# 智能学习管理助手 - 部署指南

## 部署方式一：Docker Compose（推荐）

### 环境要求
- Docker 20.10+
- Docker Compose 2.0+
- 服务器内存 2GB+

### 快速部署

1. **克隆代码到服务器**
```bash
git clone <你的代码仓库>
cd daka_Assistant
```

2. **配置环境变量（可选）**
```bash
# 创建环境变量文件
cat > .env << EOF
DB_PASSWORD=你的数据库密码
JWT_SECRET=你的JWT密钥
EOF
```

3. **一键部署**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

4. **查看部署状态**
```bash
docker-compose -f docker-compose.prod.yml ps
```

5. **访问应用**
- 前端：http://你的服务器IP
- 后端 API：http://你的服务器IP:3000/api
- API 文档：http://你的服务器IP:3000/api/docs

### 常用命令

```bash
# 查看日志
docker-compose -f docker-compose.prod.yml logs -f

# 查看后端日志
docker-compose -f docker-compose.prod.yml logs -f backend

# 重启服务
docker-compose -f docker-compose.prod.yml restart

# 停止服务
docker-compose -f docker-compose.prod.yml down

# 更新部署（拉取新代码后）
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

---

## 部署方式二：手动部署

### 后端部署

1. **安装 Node.js 20+**

2. **安装依赖并构建**
```bash
cd daka-backend
npm install
npm run build
```

3. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库等参数
```

4. **启动服务**
```bash
npm run start:prod
```

### 前端部署

1. **安装依赖并构建**
```bash
cd daka-web
npm install
npm run build
```

2. **使用 Nginx 部署**
```bash
# 复制构建产物到 Nginx 目录
cp -r dist/* /var/www/html/

# 复制 Nginx 配置
cp nginx.conf /etc/nginx/conf.d/daka.conf

# 重启 Nginx
nginx -s reload
```

---

## 部署方式三：云平台部署

### 阿里云/腾讯云/华为云

1. **购买云服务器**（推荐 2核4G）

2. **安装 Docker**
```bash
curl -fsSL https://get.docker.com | sh
```

3. **按方式一部署即可**

### Vercel（前端）+ Railway/Render（后端）

#### 前端部署到 Vercel

1. 推送代码到 GitHub
2. 登录 Vercel，导入项目
3. 选择 `daka-web` 目录
4. 构建命令：`npm run build`
5. 输出目录：`dist`
6. 添加环境变量：`VITE_API_BASE_URL=https://你的后端地址/api`

#### 后端部署到 Railway/Render

1. 登录 Railway/Render
2. 新建项目，连接 GitHub
3. 选择 `daka-backend` 目录
4. 添加 PostgreSQL 和 Redis 服务
5. 配置环境变量
6. 部署

---

## 域名和 HTTPS 配置

### 使用 Nginx Proxy Manager

```bash
# 安装 Nginx Proxy Manager
docker run -d \
  --name npm \
  -p 80:80 \
  -p 81:81 \
  -p 443:443 \
  -v npm_data:/data \
  -v npm_certs:/etc/letsencrypt \
  jc21/nginx-proxy-manager:latest
```

访问 `http://服务器IP:81` 管理界面，配置反向代理和 SSL。

### 手动配置 HTTPS

```bash
# 安装 certbot
apt-get install certbot python3-certbot-nginx

# 申请证书
certbot --nginx -d yourdomain.com

# 自动续期
certbot renew --dry-run
```

---

## 数据库备份

### 自动备份脚本

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backup/daka"
DATE=$(date +%Y%m%d_%H%M%S)

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份 PostgreSQL
docker exec daka-postgres pg_dump -U daka_user daka_db > $BACKUP_DIR/daka_$DATE.sql

# 保留最近 7 天的备份
find $BACKUP_DIR -name "daka_*.sql" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/daka_$DATE.sql"
```

### 添加定时任务

```bash
# 每天凌晨 2 点备份
crontab -e
0 2 * * * /path/to/backup.sh >> /var/log/daka_backup.log 2>&1
```

---

## 监控和日志

### 查看实时日志

```bash
# 所有服务
docker-compose -f docker-compose.prod.yml logs -f

# 仅后端
docker-compose -f docker-compose.prod.yml logs -f backend

# 仅前端
docker-compose -f docker-compose.prod.yml logs -f frontend
```

### 使用 Portainer 管理容器

```bash
docker run -d \
  --name portainer \
  -p 9000:9000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest
```

访问 `http://服务器IP:9000`

---

## 故障排查

### 服务无法启动

```bash
# 查看详细日志
docker-compose -f docker-compose.prod.yml logs

# 检查端口占用
netstat -tlnp | grep 3000
netstat -tlnp | grep 80
```

### 数据库连接失败

```bash
# 检查数据库状态
docker-compose -f docker-compose.prod.yml ps postgres

# 进入数据库容器
docker exec -it daka-postgres psql -U daka_user -d daka_db
```

### 前端无法访问 API

```bash
# 检查后端健康状态
curl http://localhost:3000/health

# 检查 Nginx 配置
nginx -t
```

---

## 更新部署

```bash
# 1. 拉取最新代码
git pull

# 2. 重新构建并启动
docker-compose -f docker-compose.prod.yml up -d --build

# 3. 清理旧镜像
docker image prune -f
```

---

## 安全建议

1. **修改默认密码**：务必修改数据库密码和 JWT 密钥
2. **启用防火墙**：只开放 80、443、22 端口
3. **定期更新**：及时更新系统和 Docker 镜像
4. **使用 HTTPS**：生产环境必须使用 HTTPS
5. **备份数据**：定期备份数据库

---

## 联系支持

部署遇到问题？
- 查看日志：`docker-compose logs`
- 提交 Issue：GitHub Issues
- 邮件支持：your-email@example.com
