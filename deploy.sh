#!/bin/bash

# 智能学习管理助手 - 一键部署脚本
# 支持：Ubuntu / CentOS / Debian

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 打印信息
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
    print_error "请使用 root 用户运行此脚本"
    exit 1
fi

# 检查系统类型
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME
else
    print_error "无法检测操作系统类型"
    exit 1
fi

print_info "检测到操作系统: $OS"

# 安装 Docker
install_docker() {
    print_info "正在安装 Docker..."
    
    if command -v docker &> /dev/null; then
        print_warn "Docker 已安装，跳过"
        return
    fi

    curl -fsSL https://get.docker.com | sh
    
    # 启动 Docker
    systemctl start docker
    systemctl enable docker
    
    print_info "Docker 安装完成"
}

# 安装 Docker Compose
install_docker_compose() {
    print_info "正在安装 Docker Compose..."
    
    if command -v docker-compose &> /dev/null; then
        print_warn "Docker Compose 已安装，跳过"
        return
    fi

    # 安装 Docker Compose
    DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)
    curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    
    # 创建软链接
    ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
    
    print_info "Docker Compose 安装完成"
}

# 配置环境
setup_environment() {
    print_info "配置环境..."
    
    # 创建项目目录
    PROJECT_DIR="/opt/daka-assistant"
    mkdir -p $PROJECT_DIR
    cd $PROJECT_DIR
    
    # 检查是否已有代码
    if [ ! -d "daka-backend" ]; then
        print_warn "请将项目代码复制到 $PROJECT_DIR 目录"
        print_info "可以使用: git clone <你的仓库> $PROJECT_DIR"
        exit 1
    fi
    
    # 生成随机密码
    DB_PASSWORD=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 16)
    JWT_SECRET=$(openssl rand -base64 64)
    
    # 创建环境变量文件
    cat > .env << EOF
DB_PASSWORD=${DB_PASSWORD}
JWT_SECRET=${JWT_SECRET}
EOF
    
    print_info "环境配置完成"
    print_info "数据库密码: ${DB_PASSWORD}"
    print_info "已保存到 .env 文件"
}

# 部署应用
deploy_app() {
    print_info "开始部署应用..."
    
    cd /opt/daka-assistant
    
    # 拉取最新镜像
    docker-compose -f docker-compose.prod.yml pull
    
    # 构建并启动
    docker-compose -f docker-compose.prod.yml up -d --build
    
    # 等待服务启动
    print_info "等待服务启动..."
    sleep 10
    
    # 检查服务状态
    if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
        print_info "应用部署成功！"
    else
        print_error "应用部署失败，请检查日志"
        docker-compose -f docker-compose.prod.yml logs
        exit 1
    fi
}

# 配置防火墙
setup_firewall() {
    print_info "配置防火墙..."
    
    if command -v ufw &> /dev/null; then
        # Ubuntu/Debian
        ufw allow 80/tcp
        ufw allow 443/tcp
        ufw allow 22/tcp
        ufw --force enable
    elif command -v firewall-cmd &> /dev/null; then
        # CentOS/RHEL
        firewall-cmd --permanent --add-port=80/tcp
        firewall-cmd --permanent --add-port=443/tcp
        firewall-cmd --permanent --add-port=22/tcp
        firewall-cmd --reload
    fi
    
    print_info "防火墙配置完成"
}

# 显示访问信息
show_access_info {
    IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')
    
    echo ""
    echo "========================================"
    echo "  🎉 智能学习管理助手部署成功！"
    echo "========================================"
    echo ""
    echo "📱 前端访问: http://$IP"
    echo "🔌 API 地址: http://$IP:3000/api"
    echo "📚 API 文档: http://$IP:3000/api/docs"
    echo ""
    echo "📁 项目目录: /opt/daka-assistant"
    echo "🔧 管理命令:"
    echo "   查看状态: docker-compose -f docker-compose.prod.yml ps"
    echo "   查看日志: docker-compose -f docker-compose.prod.yml logs -f"
    echo "   重启服务: docker-compose -f docker-compose.prod.yml restart"
    echo "   停止服务: docker-compose -f docker-compose.prod.yml down"
    echo ""
    echo "⚠️  请立即修改默认密码并配置 HTTPS"
    echo "📖 详细文档: DEPLOY.md"
    echo "========================================"
}

# 主函数
main() {
    echo "========================================"
    echo "  智能学习管理助手 - 一键部署"
    echo "========================================"
    echo ""
    
    # 安装依赖
    install_docker
    install_docker_compose
    
    # 配置环境
    setup_environment
    
    # 部署应用
    deploy_app
    
    # 配置防火墙
    setup_firewall
    
    # 显示访问信息
    show_access_info
}

# 运行主函数
main
