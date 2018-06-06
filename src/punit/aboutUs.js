
export default {
    
    data:function () {
      return {
        from: '/homePage/myCenter'
        };
    },
    methods: {
        back(){
            // this.$router.push(this.from)
            history.go(-1)
        },
    }
};
