<template>
  <div>
    {{msg}}
  </div>
</template>
<script>
export default {
  name: 'PageA',
  data() {
    return {
      msg: '等风来'
    }
  },
  mounted() {
    this.callFunAll()
  },
  methods: {
    callFunAll() {
      this.fun1()
    },
    fun1() {
      const data = {
        a: "aaa",
        b: undefined,
        c: Symbol("dd"),
        fn: function() {
          return true;
        }
      };
      // JSON.stringify(data) // 输出：？
      console.log(JSON.stringify(data)) // {"a":"aaa"}
    }
  },
}
</script>
