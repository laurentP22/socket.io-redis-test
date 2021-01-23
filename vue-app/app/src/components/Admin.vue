<template>
  <div>
    <div class="card">
      <p class="card-text"> Welcome to the admin page, connected : {{socket.connected}} </p>
    </div>
    <br>
    <div class="row">
      <div class="col">
          <button @click="getAllRooms" class="btn btn-primary btn-block">Get all rooms</button>
      </div>
    </div>
    <br>
    <div class="row">
      <div class="col">
          <button @click="getAllSockets" class="btn btn-primary btn-block">Get all sockets</button>
      </div>
    </div>  
    <br>
    <div class="row">
      <div class="col">
          <button @click="customRequest" class="btn btn-primary btn-block">Send custom request</button>
      </div>
    </div>    
  </div>

</template>

<script>
/* eslint-disable */

import io from 'socket.io-client';
export default {
  name: 'Admin',
  data () {
    return {
      socket : io('/admin'),
    }
  },
  created: function () {
    this.socket.on('error', err =>{
        console.log(err)
    });
  },
  methods: {
      getAllRooms : function(e){
        this.socket.emit("get_all_rooms",(err,rooms) =>{
          if(err){
            console.log(err)
          }else{
            console.log(rooms)
          }
        });
      },
      getAllSockets : function(e){
        this.socket.emit("get_all_sockets",(err,sockets) =>{
          if(err){
            console.log(err)
          }else{
            console.log(sockets)
          }
        });
      },
      customRequest : function(e){
        this.socket.emit("custom_request",(err,replies) =>{
          if(err){
            console.log(err)
          }else{
            console.log(replies)
          }
        });
      } 
  }
}
</script>