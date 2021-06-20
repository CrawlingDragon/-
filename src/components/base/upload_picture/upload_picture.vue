<template>
  <div>
    <van-field name="uploader" label="照片">
      <template #input>
        <van-uploader
          v-model="uploader"
          :after-read="afterRead"
          :before-delete="deleteItem"
          accept="image/*"
          :max-count="6"
          :before-read="beforeRead"
        />
      </template>
    </van-field>
  </div>
</template>
<script>
export default {
  name: "component_name",
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {}
};
</script>
<style lang="stylus" scoped></style>
