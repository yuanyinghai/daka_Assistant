# 智能学习管理助手

一个面向家庭教育的 SaaS 工具，帮助家长和孩子共同管理学习计划、打卡记录、积分激励和数据统计。

## 项目结构

```
daka_Assistant/
├── daka-backend/          # Nest.js 后端服务
│   ├── src/
│   │   ├── entities/      # 数据库实体
│   │   ├── modules/       # 业务模块
│   │   ├── common/        # 公共工具
│   │   └── config/        # 配置文件
│   ├── docker-compose.yml # Docker 编排
│   └── Dockerfile         # 容器构建
│
└── daka-app/              # UniApp 前端应用
    ├── pages/             # 页面
    ├── components/        # 组件
    ├── api/               # API 封装
    └── store/             # 状态管理
```

## 技术栈

### 后端
- **框架**: Nest.js (TypeScript)
- **数据库**: PostgreSQL + TypeORM
- **缓存**: Redis
- **认证**: JWT
- **文档**: Swagger/OpenAPI
- **容器**: Docker + Docker Compose

### 前端
- **框架**: UniApp (Vue 3 + TypeScript)
- **UI 库**: uview-plus
- **状态管理**: Pinia
- **构建工具**: Vite

## 快速开始

### 环境要求
- Node.js 18+
- Docker Desktop
- Git

### 1. 克隆项目

```bash
git clone <repository-url>
cd daka_Assistant
```

### 2. 启动后端服务

```bash
cd daka-backend

# 方式一：使用 Docker（推荐）
docker-compose up -d

# 方式二：本地开发
npm install
npm run start:dev
```

Docker 启动后：
- 后端 API: http://localhost:3000
- API 文档: http://localhost:3000/api/docs
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### 3. 启动前端应用

```bash
cd daka-app

npm install

# H5 开发
npm run dev:h5

# 微信小程序
npm run dev:mp-weixin
```

## 功能模块

### 已开发
- ✅ 用户注册/登录
- ✅ JWT 认证
- ✅ 家庭管理（创建、加入、成员管理）
- ✅ 用户资料管理
- ✅ 基础页面框架

### 待开发
- 📝 学习计划管理
- 📝 打卡记录
- 📝 积分系统
- 📝 数据统计
- 📝 AI 功能

## API 文档

启动后端服务后，访问 http://localhost:3000/api/docs 查看 Swagger 文档。

## 开发计划

详见 `docs/superpowers/plans/` 目录下的迭代计划文档。

## 许可证

MIT
