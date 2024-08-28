Component({
  properties: {

    carddata: {
      type: Object, // 或者其他合适的类型
      image: String,
      name: String,
      region: String,
      date: String,
      desc: String,
      publish_time: String,
      id:String
      
    },

    handle: Boolean
  },
  methods: {
    /* 向父组件传送的数据 */ 

    toDelete(e) {
      // console.log(e);
      const {
        id
      } = e.currentTarget.dataset
      this.triggerEvent('getdelete', id);
    },

    toUpdata(e) {
      const {
        id
      } = e.currentTarget.dataset
      this.triggerEvent('getupdata', id);
    },
  }
})