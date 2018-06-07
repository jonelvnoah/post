import api from '@/services/api'

export default {
    fetchPosts (){
        return api().get('posts')
    },

    addPost (params){
        return api().post('posts', params)
    },

    updatePost (params){
        return api().put('posts/' + params.id, params)
    },

    getPost (params) {
        return api().get('post/' + params.id)
    },

    deletePost (id){
        return api().delete('posts/' + id)
    }
}