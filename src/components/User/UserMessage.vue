<template>
  <h3 :style="fontSize"> 
      <span :style="username">{{ message.author }}</span>
      <span id="separator">: </span>
      <span :style="body">{{ message.body }}</span>  
  </h3>
</template>

<script>
export default {
    data() {
        return {
            username: `color: ${this.message.nameColor || 'green'}`,
            body: `color: ${this.message.bodyColor || 'white'}`,
            fontSize: `font-size: ${this.message.size || 16 }`,
            separator: `font-size: ${this.message.size - 3 || 12}`,
        }
    },
    props: ['message'],
}
</script>

<style>
 #separator {
     padding-left: 1px;
 }
</style>