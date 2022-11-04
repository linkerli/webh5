import storage from 'libs/storage'
import {getuserInfo,h5login} from '@/api/user'
export default {
    state: {
        userInfo: '',
        urid: localStorage.getItem('urid'),
        token: localStorage.getItem('token')
    },
    mutations: {
        SET_USERID: (state, userid) =>{
            state.userid = userid
        },
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        setUserInfo(state, userInfo) {
            storage.set('userInfo', userInfo);
            state.userInfo = userInfo
        },
        clearUserInfo(state){
            storage.remove('userInfo')
            state.userInfo=''
        }
    },
    actions: {
        login({ commit }, data) {
            const { code } = data
            return new Promise((resolve, reject) => {
                h5login({ code: code }).then(response => {
                    if(response.status === 200) {
                        commit('SET_TOKEN', response.data.token)
                        commit('SET_USERID', response.data.urid)
                        localStorage.setItem('urid',response.data.urid)
                        localStorage.setItem('token',response.data.token)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        getUserInfo({ commit}) {
            return new Promise((resolve, reject) => {
                try {
                    //直接用本地缓存 不请求数据
                    storage.get('userInfo').then((res)=>{
                        if(!!res)  {
                            reject(res);
                            return ;
                        }
                        getuserInfo(res).then((re)=>{
                            if(+re.status===200){
                                resolve(res)
                            }else{
                                reject(res);
                            }
                        },(error)=>{
                            reject(error);
                        })

                    })
                } catch (error) {
                    reject(error);
                }
            });
        }
    }
}