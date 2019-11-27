# Helm deployment

## Files & Properties

- Chart.yaml: 基本属性定义
- values.yaml: 值(可变)属性定义
- /templates
  - \_helpers.tpl: 动态拼接生成的一些 value
  - \*.yaml: 模板文件
    > `include` from _\_helpers.tpl_
    > `.Values` from _values.yaml_
    > `.Chart` from _Chart.yaml_

## Deploy

install: 安装
upgrade: 更新