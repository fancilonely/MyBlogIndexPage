<template>
  <footer id="footer" :class="store.footerBlur ? 'blur' : null">
    <Transition name="fade" mode="out-in">
      <div v-if="!store.playerState || !store.playerLrcShow" class="power">
        <!-- Edit this footer text to add ICP filing number or custom copyright text. -->
        <span>
          © 2026 梦幻空白 · Based on
          <a
            href="https://github.com/fancilonely/MyBlogIndexPage"
            target="_blank"
            rel="noopener noreferrer"
          >
            fancytowa
          </a>
        </span>
      </div>
      <div v-else class="lrc">
        <Transition name="fade" mode="out-in">
          <div class="lrc-all" :key="store.getPlayerLrc">
            <music-one theme="filled" size="18" fill="#efefef" />
            <span class="lrc-text text-hidden" v-html="store.getPlayerLrc" />
            <music-one theme="filled" size="18" fill="#efefef" />
          </div>
        </Transition>
      </div>
    </Transition>
  </footer>
</template>

<script setup>
import { MusicOne } from "@icon-park/vue-next";
import { mainStore } from "@/store";

const store = mainStore();
</script>

<style lang="scss" scoped>

#footer {

  width: 100%;
  height: 42px;
  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;


  position: relative;

  z-index: 10;


  font-size:14px;
  white-space: nowrap;


  color:rgba(23,32,51,0.75);


  background:rgba(255,255,255,0.28);

  backdrop-filter:blur(12px);

  border-top:
    1px solid rgba(255,255,255,0.45);



  .power {

    animation:fade 0.3s;


    span {

      color:rgba(23,32,51,0.75);

      font-weight:600;

    }


    a {

      color:#4f7cff;

      font-weight:700;


      &:hover {

        text-decoration:underline;

      }

    }

  }



  .lrc {

    width:100%;

    display:flex;

    justify-content:center;

    align-items:center;


    .lrc-all {

      display:flex;

      align-items:center;

      justify-content:center;


      .lrc-text {

        margin:0 8px;

      }

    }

  }



  &.blur {

    background:
    rgba(255,255,255,0.35);

    backdrop-filter:blur(16px);

  }



  @media(max-width:720px){
    font-size:0.85rem;


    .power {

      padding:0 12px;

      white-space:normal;

      text-align:center;

      line-height:1.3;

    }

  }

}

</style>
