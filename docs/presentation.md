---
marp: true
title: AHUER.com 校园二手物品交易系统
paginate: true
---

# 校园二手交易系统 AHUER.COM

周裕佳，齐子祥，费彦棋，钱锦程，袁宏锐，李若凡

---

# 目录

- 系统概要
- 页面设计展示
- 视频展示
- 设计要点说明

---

# 系统概要

一个面相校园的二手物品交易看板网站。

---

# 主要角色

- 买家
- 卖家
- 管理员
- ...

---

# 买家

- 搜索物品
- 查看物品信息
- 发起交易/查看交易状态

---

# 卖家

- 物品管理
  - 发布物品
  - 编辑物品
  - 删除物品
- 交易管理 (同意/拒绝交易)

---

# 管理员

- 查看系统状态
- 近期发布
  - 审查发布内容

---

# 页面设计

---

# 账户登录

---

![w:1000](./assets/signinup.png)

---

![](./assets/signinup_error.png)

---

![](./assets/signin_async_button.png)

---

![bg left:50%](./assets/signin_async_button.png)

**可观察性**

用户点击后，对系统工作状态进行反馈。

**减少错误**

点击一次登录按钮后，<u>按钮被禁用</u>，防止用户二次提交。

---

![bg left:50](./assets/signin_failed.png)
![bg right:50](./assets/signin_success.png)

---

# 主页

---

![w:1000](./assets/home_page.png)

---

# 用户资料页

---

![bg left:65%](./assets/navbar_avatar.png)

- 图标
- 颜色

---

![bg](./assets/navbar_hover_1.png)
![bg](./assets/navbar_hover_2.png)

---

![w:1000](./assets/user_profile.png)

---

![w:1000](./assets/user_contact_verified.png)

---

![w:1000](./assets/user_contact_remove.png)

---

![w:1000](./assets/user_contact_add.png)

---

![w:1000](./assets/user_contact_add_2.png)

---

![w:1000](./assets/user_contact_info_err.png)

---

# 发布物品管理

---

![w:1000](./assets/publish.png)

---

![w:1000](./assets/publish_hover.png)

---

![w:1000](./assets/publish_edit.png)

---

![w:900](./assets/publish_desc.png)

---

![](./assets/publish_edit_price_1.png)

![](./assets/publish_edit_price_2.png)

![](./assets/publish_edit_price_3.png)

---

![w:1300](./assets/publish_edit_tag.png)

![w:1020](./assets/publish_edit_tag_2.png)

---

![w:1020](./assets/publish_img_copy.png)

---

# 物品详情页

---

![w:1000](./assets/item.png)

---

![](./assets/item_buy_disabled.png)

![](./assets/item_buy_sold.png)

---

![](./assets/item_alert_sold.png)

---

![w:1000](./assets/item_not_login.png)

---

# 交易处理页

---

**业务逻辑** *https://wiki.api.ahuer.com/Transaction-Design*

![w:1000](./assets/transaction_business_logic.png)

---

![](./assets/transaction_main.png)

---

# 搜索页面

---

![w:1000](./assets/home_page.png)

---

![](./assets/search_main.png)

---

![](./assets/search_res.png)

用户持续输入文字。系统监听用户输入，持续更新临时变量。

用户停止输入一段时间（e.g.: `1s`）后，自动发送搜索请求 _(Debouncing)_。

---

# 视频演示

通过录屏，简要展示系统的可用性和主要功能。

> `./assets/ahuer_demo_video.mp4`

---

# 其他设计细节

对上方页面展示中提到的设计要点进行补充说明，同时介绍系统部分其他亮点。

---

# Full DarkMode Support

100% 全组件和页面覆盖的深色模式支持，并自动跟随用户系统设置关闭或开启。

---

![w:1000](./assets/darkmode_1.png)

---

![w:1000](./assets/darkmode_2.png)

---

![w:1000](./assets/darkmode_3.png)

---

# Loading Skeleton

页面加载时展示内容骨架或其他加载图像，为用户提供合理的反馈。

---

![w:1000](./assets/loading_skeleton.png)

---

![w:1000](./assets/loading_skeleton_2.png)

---

# **Responsive** Design

重要组件实现响应式设计，为不同分辨率/大小的屏幕提供个性化和舒适的浏览体验。

---

![](./assets/responsive_large.png)

**宽屏幕：**

对内容进行 `maxWidth` 限制，限制主要内容的最大宽度，保证良好的阅读体验。

---

![bg left:32%](./assets/responsive_mid.png)

**窄屏幕：**

适当缩减网格纵向列数，对部分元素进行自动换行。

---

# 统一性

元素，组件，设计元素 (Design Token) 尽量保持一致，实现相对统一的设计风格，
为用户提供统一的浏览体验。

---

![](./assets/layout_1.png)

---

![](./assets/layout_2.png)

---

# 自动化测试

开发过程中尽可能为重要模块添加单元测试/自动化测试流程，确保程序可用性和
低错误率。

---

![w:1000](./assets/api_test.png)

---

![w:1000](./assets/api_test_res.png)

---

# Interactive API References

面相前端 UI/UX 开发者的交互式 API 文档与测试工具。

---

![w:1000](./assets/api_ref_doc.png)

---

# More

- **组件统一性**
  - 基本组件统一 (`Header`, `Tags`, ...)
  - 自定义组件统一 (`ItemCard`, `ItemListGrid`, ...)
- **布局统一性**
  - 合理的 `Layout` 重用
  - 统一的 Design Token (`Padding`, `Gap`, ...)

---

# 谢谢大家
