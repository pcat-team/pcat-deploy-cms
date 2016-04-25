# pcat-deploy-cms

use
```javascript
fis.match('**.html',{
	deploy:fis.plugin('cms', {
            project: packageJson.name,
            userName:userName,
              api:commonConfig.api
            })
})
```

对接接口的参数
```javascript
{
  actionType：模板动作参数：新增(add)、修改(edit)、删除(delete)
  name: 模板名称(必填，模板的名称唯一)
  path：模板分类(必填)
  text：模板内容(必填)
  userName：模板作者名称(必填)
  channelId：栏目ID(必填）
  tplType：模板类型(必填 1-栏目模板，2-文章模板)
  templateCate：多模板类型(选填，不填默认为栏目主模板)

  isZt：专题模板类型 1、文章 2、栏目(专题模板必填)
  ztName：专题模板显示名称(专题模板必填)
  pictureUrl：示意图url(专题模板必填)
  modelNumber: 普通板块数量(专题模板必填)
  regionNumber：隐藏板块数量(专题模板必填)
  ztConfig：模块配置(专题模板必填)
  category：专题模板分类(电脑网用)
  commitMessage：版本日志(选填）
}
```

