<!-- src\components\ProjectList.vue -->
<template>
  <div class="project-list">

    <a
      v-for="project in projects"
      :key="project.name"
      class="project-card"
      :href="project.url"
      target="_blank"
      rel="noopener noreferrer"
    >

      <div class="project-header">

        <span class="repo-icon">
          ▣
        </span>


        <span class="project-name">
          {{ project.name }}
        </span>

      </div>


      <div class="project-description">

        {{ project.description }}

      </div>



      <div class="project-footer">


        <span
          v-if="project.language"
          class="language"
        >

          <span
            class="dot"
            :class="project.color"
          ></span>

          {{ project.language }}

        </span>



        <span
          v-if="project.star"
          class="star"
        >

          ★ {{ project.star }}

        </span>


      </div>


    </a>

  </div>
</template>



<script setup>

const projects = [

{
name:"CPT108_23_24",
description:"",
language:"",
star:4,
color:"",
url:"https://github.com/fancilonely/CPT108_23_24"
},


{
name:"Personalized_Phototherapy_Mask_MEC202_XJTLU",
description:"",
language:"Python",
star:null,
color:"blue",
url:"https://github.com/fancilonely/Personalized_Phototherapy_Mask_MEC202_XJTLU"
},


{
name:"Biztrack-Order-Management",
description:"",
language:"JavaScript",
star:null,
color:"yellow",
url:"https://github.com/fancilonely/Biztrack-Order-Management"
},


{
name:"MyBlogIndexPage",
description:"MyBlogIndexPage",
language:"Vue",
star:null,
color:"green",
url:"https://github.com/fancilonely/MyBlogIndexPage"
}

]

</script>



<style lang="scss" scoped>


.project-list {

  width:100%;

  max-width:520px;

  display:grid;

  grid-template-columns:
  repeat(2,minmax(160px,1fr));

  gap:16px;

}



.project-card {


  min-height:120px;

  padding:16px;


  box-sizing:border-box;


  border-radius:14px;


  background:
  rgba(255,255,255,.58);


  border:
  1px solid rgba(255,255,255,.55);


  backdrop-filter:
  blur(14px);


  text-decoration:none;


  color:#172033;


  transition:
  transform .25s,
  background .25s;


  &:hover {

    transform:
    translateY(-3px);


    background:
    rgba(255,255,255,.72);

  }


}



.project-header {


  display:flex;

  align-items:center;

  gap:8px;


}



.repo-icon {

  color:#52607a;

  font-size:14px;

}



.project-name {


  flex:1;


  font-size:.92rem;


  font-weight:800;


  overflow:hidden;


  text-overflow:ellipsis;


  white-space:nowrap;


}



.project-description {


  margin-top:18px;


  height:20px;


  overflow:hidden;


  text-overflow:ellipsis;


  white-space:nowrap;


  font-size:.82rem;


  color:
  rgba(23,32,51,.65);

}



.project-footer {


  margin-top:22px;


  display:flex;


  justify-content:space-between;


  align-items:center;


  font-size:.8rem;


  font-weight:700;

}



.language {


  display:flex;

  align-items:center;

  gap:6px;


}



.dot {


  width:10px;

  height:10px;

  border-radius:50%;


  &.blue {

    background:#3572A5;

  }


  &.yellow {

    background:#f1e05a;

  }


  &.green {

    background:#41b883;

  }


}



.star {

 color:#52607a;

}



@media(max-width:720px){


.project-list{

 grid-template-columns:1fr;

}


}

</style>