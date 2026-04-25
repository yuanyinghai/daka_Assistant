# 迭代三详细实施计划

**迭代周期**: Week 9-12（共4周）  
**迭代目标**: 生态完善 - 家长端功能与AI能力  
**交付标准**: 完整产品版本，支持上线运营

---

## 一、迭代概览

### 1.1 迭代范围

```
✅ 包含功能：
├── 习惯养成模块（好习惯+坏习惯）
├── 成绩追踪模块
├── 家长审定中心
├── AI智能添加计划
├── 多端同步
├── 番茄钟（倒计时）
└── 性能优化与上线准备

❌ 不包含功能：
├── 社交功能（分享/排名）
├── 付费会员
├── 第三方登录
└── 小程序版本
```

### 1.2 工时估算

| 模块 | 后端(人日) | 前端(人日) | 设计(人日) | 总计 |
|------|-----------|-----------|-----------|------|
| 习惯养成 | 4 | 5 | 2 | 11 |
| 成绩追踪 | 3 | 4 | 1 | 8 |
| 家长审定 | 3 | 4 | 2 | 9 |
| AI功能 | 4 | 3 | 1 | 8 |
| 多端同步 | 3 | 3 | 0 | 6 |
| 番茄钟 | 2 | 3 | 1 | 6 |
| 性能优化 | 2 | 3 | 0 | 5 |
| 上线准备 | 2 | 2 | 1 | 5 |
| **合计** | **23** | **27** | **8** | **58** |

---

## 二、Week 9：习惯养成模块（第9周）

### 2.1 本周目标

- 实现习惯养成功能
- 支持好习惯和坏习惯双轨
- 完成习惯打卡日历

### 2.2 每日任务分解

#### Day 57-59（周一、二、三）：习惯功能后端

**数据库表设计**
```sql
-- 习惯表
CREATE TABLE habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    icon VARCHAR(50),
    type VARCHAR(20) NOT NULL CHECK (type IN ('positive', 'negative')),
    frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('daily_once', 'daily_multi')),
    target_times INTEGER DEFAULT 1,
    reward_stars INTEGER DEFAULT 0,
    penalty_stars INTEGER DEFAULT 0,
    reminder_time TIME,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 习惯打卡记录表
CREATE TABLE habit_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
    child_id UUID REFERENCES users(id) ON DELETE CASCADE,
    record_date DATE NOT NULL,
    checkin_count INTEGER DEFAULT 1,
    earned_stars INTEGER DEFAULT 0,
    note VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(habit_id, record_date)
);
```

**API 开发**
```typescript
// 习惯相关 API
GET /habits
POST /habits
PUT /habits/:id
DELETE /habits/:id
POST /habits/:id/checkin
GET /habits/calendar?month=
GET /habits/statistics
```

**业务逻辑**
- [ ] 习惯创建逻辑
- [ ] 打卡判断（每日一次/多次）
- [ ] 积分计算（奖励/扣分）
- [ ] 习惯统计（连续天数、完成率）

**交付物检查点**
- 可创建好习惯/坏习惯
- 打卡逻辑正确
- 积分变动正确

#### Day 60-61（周四、五）：习惯页面前端

**页面开发**
- [ ] 习惯列表页
- [ ] 习惯分类标签（好习惯/坏习惯）
- [ ] 习惯卡片组件
- [ ] 习惯打卡日历

**习惯卡片设计**
```
好习惯卡片：
┌─────────────────────────────────────────┐
│                                         │
│  🌙 早睡（22:00前）              +2⭐  │
│  今日 0/1                               │
│                                         │
│  本周 5/7 天      连续 3 天 🔥           │
│                    [  打卡  ]            │
│                                         │
└─────────────────────────────────────────┘

坏习惯卡片：
┌─────────────────────────────────────────┐
│                                         │
│  🎮 玩游戏超时（>1小时）         -2⭐  │
│  今日发生 0 次                          │
│                                         │
│  本周发生 2 次    累计扣分 -4⭐          │
│  [记录发生]  [查看记录]                  │
│                                         │
└─────────────────────────────────────────┘
```

**交付物检查点**
- 习惯列表展示正常
- 打卡功能正常
- 日历热力图正确

#### Day 62-63（周末）：习惯激励与测试

**激励功能**
- [ ] 习惯打卡动画
- [ ] 连续习惯天数火焰
- [ ] 习惯统计展示

**测试优化**
- [ ] 习惯创建测试
- [ ] 打卡流程测试
- [ ] 积分计算验证

---

## 三、Week 10：成绩追踪与家长审定（第10周）

### 3.1 本周目标

- 实现成绩追踪模块
- 完成家长审定中心
- 搭建家长端框架

### 3.2 每日任务分解

#### Day 64-66（周一、二、三）：成绩追踪

**数据库表设计**
```sql
-- 成绩表
CREATE TABLE exam_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subject INTEGER NOT NULL CHECK (subject BETWEEN 1 AND 13),
    exam_name VARCHAR(200) NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    total_score DECIMAL(5,2) NOT NULL,
    score_rate DECIMAL(5,2), -- 得分率
    class_rank INTEGER,
    grade_rank INTEGER,
    exam_date DATE NOT NULL,
    comment TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

**API 开发**
```typescript
// 成绩相关 API
GET /exams
POST /exams
PUT /exams/:id
DELETE /exams/:id
GET /exams/statistics
GET /exams/trends?subject=
```

**前端开发**
- [ ] 成绩列表页
- [ ] 成绩录入弹窗
- [ ] 成绩趋势图
- [ ] 科目统计

**成绩页设计**
```
┌─────────────────────────────────────────┐
│  成绩追踪                    [➕添加]   │
├─────────────────────────────────────────┤
│                                         │
│  考试总数 12    平均得分率 85%           │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │    📈 成绩趋势图                 │    │
│  └─────────────────────────────────┘    │
│                                         │
│  最近考试                               │
│  ┌─────────────────────────────────┐    │
│  │ 数学期中考试        95/100      │    │
│  │ 班级排名：5/45                   │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

**交付物检查点**
- 可录入成绩
- 可查看趋势
- 统计数据准确

#### Day 67-68（周四、五）：家长审定中心

**数据库表设计**
```sql
-- 积分待审表
CREATE TABLE pending_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    record_id UUID NOT NULL,
    record_type VARCHAR(20) NOT NULL, -- 'plan', 'habit'
    child_id UUID REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    stars_amount INTEGER NOT NULL,
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**API 开发**
```typescript
// 审定相关 API
GET /reviews/pending
POST /reviews/:id/approve
POST /reviews/:id/reject
GET /reviews/history
```

**前端开发**
- [ ] 审定中心页面
- [ ] 待审列表
- [ ] 审核操作（通过/驳回）
- [ ] 审核历史

**审定中心设计**
```
┌─────────────────────────────────────────┐
│  审定中心                               │
├─────────────────────────────────────────┤
│                                         │
│  待审核（3）                            │
│  ┌─────────────────────────────────┐    │
│  │ 📐 数学作业         申请 +5⭐    │    │
│  │ 小明  今天 15:30                 │    │
│  │ [通过] [驳回] [查看详情]         │    │
│  └─────────────────────────────────┘    │
│                                         │
│  已审核                                 │
│  ┌─────────────────────────────────┐    │
│  │ 🔤 英语朗读         已通过 +3⭐  │    │
│  │ 昨天 14:00                       │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

**交付物检查点**
- 待审列表正确显示
- 审核操作正常
- 积分正确发放/扣除

#### Day 69-70（周末）：家长端框架

**家长端页面**
- [ ] 家长端路由设计
- [ ] 家长端首页（孩子切换）
- [ ] 家长端学习计划管理
- [ ] 家长端统计查看

**孩子切换功能**
- [ ] 多孩子列表
- [ ] 切换逻辑
- [ ] 数据刷新

---

## 四、Week 11：AI功能与多端同步（第11周）

### 4.1 本周目标

- 实现AI智能添加计划
- 完成多端同步机制
- 实现番茄钟功能

### 4.2 每日任务分解

#### Day 71-73（周一、二、三）：AI智能添加

**技术方案**
- [ ] 选择AI服务（OpenAI API / 文心一言 / 通义千问）
- [ ] 设计Prompt模板
- [ ] 实现自然语言解析
- [ ] 课程表图片OCR（可选）

**Prompt设计**
```
用户输入："每天背诵10个英语单词，持续30天"

AI解析结果：
{
  "title": "英语单词背诵",
  "category": 3, // 英语
  "periodType": "daily",
  "duration": 30,
  "estimatedMinutes": 15,
  "suggestedTime": "19:00",
  "rewardStars": 3
}
```

**API 开发**
```typescript
// AI相关 API
POST /ai/parse-plan
Body: { text: string }
Response: { parsedPlan: PlanSuggestion }

POST /ai/create-plan
Body: { text: string, confirmed: boolean }
Response: { plan: StudyPlan }
```

**前端开发**
- [ ] AI创建入口
- [ ] 自然语言输入框
- [ ] 解析结果确认
- [ ] 课程表图片上传

**AI创建弹窗设计**
```
┌─────────────────────────────────────────┐
│  AI智能创建计划                  [✕]    │
├─────────────────────────────────────────┤
│                                         │
│  告诉AI你想创建什么计划：                │
│  ┌─────────────────────────────────┐    │
│  │ 每天背诵10个英语单词，持续30天   │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [🤖 生成学习计划]                      │
│                                         │
│  ─────────────────────────────────────  │
│  解析结果：                              │
│  • 计划名称：英语单词背诵                │
│  • 分类：英语                            │
│  • 周期：每天，持续30天                  │
│  • 预计时长：15分钟                      │
│  • 建议时间：19:00                       │
│                                         │
│  [确认创建]  [重新输入]                  │
│                                         │
└─────────────────────────────────────────┘
```

**交付物检查点**
- AI解析准确
- 可一键创建计划
- 用户体验流畅

#### Day 74-75（周四、五）：多端同步

**技术方案**
- [ ] WebSocket 连接管理
- [ ] 数据同步协议设计
- [ ] 离线数据缓存
- [ ] 冲突解决策略

**同步机制**
```typescript
// 同步协议
interface SyncMessage {
  type: 'update' | 'delete' | 'create';
  entity: 'plan' | 'record' | 'habit';
  data: any;
  timestamp: number;
  deviceId: string;
}

// 冲突解决：时间戳优先
function resolveConflict(local: any, remote: any): any {
  return local.updatedAt > remote.updatedAt ? local : remote;
}
```

**实现功能**
- [ ] WebSocket 连接
- [ ] 实时数据推送
- [ ] 离线数据存储（本地SQLite）
- [ ] 断线重连

**交付物检查点**
- 多端数据同步
- 离线可用
- 冲突正确处理

#### Day 76-77（周末）：番茄钟

**功能设计**
- [ ] 倒计时功能（25分钟标准）
- [ ] 可配置时长
- [ ] 休息提醒
- [ ] 番茄钟统计

**番茄钟页面**
```
┌─────────────────────────────────────────┐
│  番茄钟                          [设置] │
├─────────────────────────────────────────┤
│                                         │
│                                         │
│           ⏱️                            │
│                                         │
│         25:00                           │
│                                         │
│      专注于：数学作业                    │
│                                         │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │           [  开始  ]            │    │
│  └─────────────────────────────────┘    │
│                                         │
│  今日已完成 4 个番茄                     │
│                                         │
└─────────────────────────────────────────┘
```

**交付物检查点**
- 倒计时准确
- 后台提醒正常
- 统计正确

---

## 五、Week 12：性能优化与上线（第12周）

### 5.1 本周目标

- 完成性能优化
- 准备上线环境
- 项目收尾

### 5.2 每日任务分解

#### Day 78-80（周一、二、三）：性能优化

**前端优化**
- [ ] 图片懒加载
- [ ] 列表虚拟滚动（长列表）
- [ ] 组件按需加载
- [ ] 包体积优化（Tree Shaking）

**后端优化**
- [ ] API 响应优化（缓存）
- [ ] 数据库查询优化（索引）
- [ ] 慢查询治理
- [ ] 连接池优化

**优化清单**
```
性能指标目标：
├── 首屏加载时间 < 1.5秒
├── API 响应时间 < 300ms
├── 页面切换流畅度 > 50fps
├── 包体积 < 5MB
└── 内存占用 < 200MB
```

#### Day 81-82（周四、五）：上线准备

**生产环境部署**
- [ ] 生产服务器配置
- [ ] 域名配置
- [ ] HTTPS 证书
- [ ] CDN 配置

**监控告警**
- [ ] 错误监控（Sentry）
- [ ] 性能监控
- [ ] 业务数据监控
- [ ] 告警规则配置

**应用商店准备**
- [ ] 应用图标
- [ ] 应用截图
- [ ] 应用描述
- [ ] 隐私政策

#### Day 83-84（周末）：项目收尾

**文档整理**
- [ ] 用户手册
- [ ] 管理员手册
- [ ] API 文档最终版
- [ ] 部署文档

**项目复盘**
- [ ] 功能完成情况
- [ ] 进度偏差分析
- [ ] 技术债务整理
- [ ] 后续规划

---

## 六、技术实现细节

### 6.1 AI解析服务

```typescript
// AI服务封装
class AIService {
  private openai: OpenAIApi;
  
  async parsePlanDescription(text: string): Promise<PlanSuggestion> {
    const prompt = `
      你是一个学习计划助手。请解析用户的描述，提取以下信息：
      - 计划名称
      - 学习科目（语文/数学/英语/科学/艺术/音乐/体育/阅读/编程/写作/背诵/练习/其他）
      - 周期类型（单次/每天/每周）
      - 持续时间（天数）
      - 预计时长（分钟）
      - 建议时间段
      
      用户描述：${text}
      
      请以JSON格式返回解析结果。
    `;
    
    const response = await this.openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    });
    
    return JSON.parse(response.data.choices[0].message.content);
  }
}
```

### 6.2 WebSocket同步

```typescript
// WebSocket网关
@WebSocketGateway()
export class SyncGateway {
  @SubscribeMessage('sync')
  handleSync(client: Socket, payload: SyncMessage): void {
    const { familyId } = client.handshake.query;
    
    // 广播给同家庭其他设备
    client.to(familyId).emit('sync', payload);
    
    // 保存到数据库
    this.syncService.saveSyncEvent(payload);
  }
  
  @SubscribeMessage('join-family')
  handleJoinFamily(client: Socket, familyId: string): void {
    client.join(familyId);
  }
}
```

### 6.3 番茄钟实现

```typescript
// 番茄钟服务
class PomodoroService {
  private timers = new Map<string, NodeJS.Timeout>();
  
  start(sessionId: string, duration: number): void {
    const endTime = Date.now() + duration * 1000;
    
    this.timers.set(sessionId, setInterval(() => {
      const remaining = endTime - Date.now();
      
      if (remaining <= 0) {
        this.complete(sessionId);
      } else {
        this.emitProgress(sessionId, remaining);
      }
    }, 1000));
  }
  
  pause(sessionId: string): number {
    clearInterval(this.timers.get(sessionId));
    // 返回已进行时间
    return this.getElapsedTime(sessionId);
  }
  
  complete(sessionId: string): void {
    clearInterval(this.timers.get(sessionId));
    this.timers.delete(sessionId);
    
    // 发送完成通知
    this.notificationService.send(sessionId, '番茄钟完成！');
  }
}
```

---

## 七、上线检查清单

### 7.1 功能检查

- [ ] 所有核心功能正常
- [ ] 习惯养成模块可用
- [ ] 成绩追踪可用
- [ ] 家长审定可用
- [ ] AI功能可用
- [ ] 多端同步正常

### 7.2 性能检查

- [ ] 首屏加载 < 1.5秒
- [ ] API 响应 < 300ms
- [ ] 无内存泄漏
- [ ] 无卡顿现象

### 7.3 安全检查

- [ ] 用户数据加密
- [ ] API 鉴权完整
- [ ] 敏感操作验证
- [ ] 隐私政策合规

### 7.4 运维检查

- [ ] 监控告警配置
- [ ] 日志收集配置
- [ ] 备份策略配置
- [ ] 应急预案准备

---

## 八、项目总结

### 8.1 三个迭代交付物

| 迭代 | 周期 | 核心交付 |
|------|------|----------|
| 迭代一 | Week 1-4 | MVP版本：计划+打卡+积分 |
| 迭代二 | Week 5-8 | 体验版：+计时器+统计+愿望+成就 |
| 迭代三 | Week 9-12 | 完整版：+习惯+成绩+AI+同步 |

### 8.2 技术债务

- [ ] 单元测试覆盖率提升
- [ ] 端到端测试补充
- [ ] 性能监控完善
- [ ] 代码重构优化

### 8.3 后续规划

**短期（1-3个月）**
- 收集用户反馈
- 修复线上问题
- 优化核心流程

**中期（3-6个月）**
- 社交功能（分享/排名）
- 更多AI功能
- 小程序版本

**长期（6-12个月）
- 付费会员
- 内容生态
- 数据分析服务

---

*文档结束*
