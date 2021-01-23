
module.exports = function(io) {
    let adminNsp = io.of('/admin');

    // Set socket connection
    adminNsp.on('connection',function(socket){
        console.log('Admin connected to socket : ' + socket.id);


        adminNsp.adapter.remoteJoin(socket.id, "room1", (err) => {
            if (err) { /* unknown id */ }
            console.log('Joined room : '+ "room1");
        });

        socket.on('disconnect',(data) =>{
            console.log('Admin disconnected');
        })

        socket.on('get_all_rooms',callback =>{
            console.log("Event : get_all_rooms ");
            adminNsp.adapter.allRooms((err, rooms) => {
                if(err){
                    console.log('Error : ' + err.message)
                    callback(err.message);
                }else{
                    console.log(rooms);
                    callback(null,rooms);
                }
              }); 
        })

        socket.on('get_all_sockets',callback =>{
            console.log("Event : get_all_sockets ");
            adminNsp.adapter.clients((err, clients) => {
                if(err){
                    console.log('Error : ' + err.message)
                    callback(err.message);
                }else{
                    console.log(clients);
                    callback(null,clients);
                }
              }); 
        })

        socket.on('custom_request',callback =>{
            console.log("Event : custom_request ");
            adminNsp.adapter.customRequest('world', function(err,replies){
                if(err){
                    console.log('Error : ' + err.message)
                    callback(err.message);
                }else{
                    console.log(replies);
                    callback(null,replies);
                }
              }); 
        });
        
    })

    adminNsp.adapter.customHook = (data, cb) => {
        cb('hello ' + data);
    }
}
