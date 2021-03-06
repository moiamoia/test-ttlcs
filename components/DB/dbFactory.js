import os from 'object-serialize'

export default new class {
    create(name, methods) {
        this.DB(name,methods);
    }
    DB(name,methods) {
        for (let method in methods) {
            const config = methods[method];
            if(!this[name])this[name] = [];
            this[name][method] = query => new Request(config, query, method);
        }
        return this;
    }
}

function Request(config,body) {

    let {url,method = ''} = config;

    const needReply = url.indexOf('{');
    if(needReply !== -1){
        url = url.substring(0,needReply)+body[url.substring(needReply+1,url.length-1)];
    }
    const option = {
      // credentials: 'same-origin',
      credentials: 'include',
      mode:'cors',
      method,
      headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    if(!['GET','PUT'].includes(method.toUpperCase())){
      Object.assign(option, {
          body: os(body)
      })
    }else{
      url += `?${os(body)}`
    }

    return new Promise((resolve, reject) => {
        const Head = __PRO__?'/ttl-web-system':'/ttl-web-systemttl-web-system';//__PRO__===true 表示线上环境
        /*const Head = 'ttl-web-system';*/
        // const Head = __PRO__?'/ttl-web-system':'https://www.tongtongli.com/ttl-web-system';//__PRO__===true 表示线上环境
        fetch(Head+url,option).then(data => data.json()).then(({code,data,...err}) => {
            if (code === 0) {
                /*成功*/
                resolve(data);
                console.log('成功',data)
            } else if (code === 3303) {
                window.location.href = '#/login'
            } else {
                /*错误信息*/
                /* reject({
                   code,data,...err
                 });*/
                $message({
                    type: 'error',
                    message: err.msg
                });
                console.log('失败',{
                    code,data,...err
                })
            }
        }).catch(()=>$message({
            type: 'error',
            message: '请求失败,请稍后再试'
        }))
    })
}
