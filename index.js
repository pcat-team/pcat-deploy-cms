'use strict'
const request = require('request')
const path = require('path')
/*
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
 */

/**
 * upload cms template
 * @param  {[Object]}   options  [`api 接口域名`,`project 项目名`,`userName 用户名`]
 * @param  {[Object]}   modified [fis3 files]
 * @param  {[Object]}   total    [fis3 files]
 * @param  {Function} next     [run other deploy plugin]
 * @return {[null]}
 */
module.exports = function(options, modified, total, next) {
    // request.post()
    // console.log(modified)
    const api = options.api
    modified.forEach((file) => {
        // console.log()
        let content = file.getContent()
        let _content = content.replace(/\/\/.*?[\r\n]/gmi, '').replace(/\r|\n/gm, '')
        let _config = /.*?\<\%\-\-cms_config\-\-(.*?)\-\-\/cms_config\-\-\%\>.*/gim.test(_content) ? RegExp.$1 : !1
        let config
        if (!_config) return next();
        try {
            config = new Function('return ' + _config)().upload
        } catch (e) {
            fis.log.error('\n\r[pcat-deploy-cms:39] parse cms_config error\n\r '.red.bold + e)
            config = !1
        }

        console.log('---------------cms config -----------------');
        console.log(config);

        if (!config) return next();
        let type = config.path
        let now = new Date
        let time = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}-${now.getHours()}`
        let name = `${type}.${options.project||''}.${file.dirname.split('/').pop()}.${file.getHash()}`

        // config = config
        new Promise(function(resolve, reject) {
            request.get({
                // proxy: "http://192.168.243.232:1080",
                url: `http://${api}/admin/template/check_template.jsp?name=${name}`
            }, (err, res, body) => {

                console.log(body);

                var actionType = 'add'
                if (err) return reject(err);
                let rz = JSON.parse(body)
                console.log(rz, 'check ')
                if (rz.code === 0) actionType = 'edit';
                else if (rz.code === -1) return reject(rz.msg);
                resolve(actionType)
            })
        }).then(function(actionType) {

            config.name = name
            config.actionType = actionType
            config.userName = options.userName
            config.text = content

            // console.log(config)
            request.post({
                // proxy: "http://192.168.243.232:1080",
                url: `http://${api}/admin/template/action/http_template.jsp`,
                form: config
            }, (err, r, body) => {
                err && console.error(err, r.headers)
                let rz
                try {
                    rz = JSON.parse(body)
                } catch (e) {
                    rz = { code: -20, type: e }
                    // console.log(e,body);
                }
                if (rz.code <= -1) {
                    fis.log.error(rz.msg)
                } else {
                    body && console.log(body)
                }
                // console.log(e,r.headers,body)
            })
        }).catch((err) => {
            fis.log.info(err)
        })

    })
    next()
}