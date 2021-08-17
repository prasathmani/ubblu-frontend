
//function definition
initSocketConnection() { 
    //this method establishes the socket connection
    this.socket = io(SOCKET_URI, { transports: ['websocket'] });
}

//function definition
setupSocketListeners = async () => { 
    //this method has all the sockets events defined
    this.socket.on('connect', () => {
        console.log('connected', this.socket)
    });

    this.socket.on('disconnect', async reason => {
        console.log('reason', reason)
    });

    this.socket.on('roomDetails', (data) => {
        console.log('testing back end room data' ,data);
        this.setState({
            room_id: data.room_id
        })
    });

    this.socket.on('simulationOutput', (data) => {
        // in data.simulation_id u will get the id of the simulation response, which u will use it to to call get simulation data to fetch its data 
        this.setState({
            simulation_id: data.simulation_id
        })
    });
};

componentDidMount(){ // paste these two funcn calls inside componentDidMount

    this.initSocketConnection();
    this.setupSocketListeners();
    this.createRooms();

}

// on click of generate cadence u have to call the function written below
generateCadence = () => {
    this.socket.emit('generate cadence', {
      room_id: this.state.roomId,
      url: url, // url of the optimisation api,
      request_obj: requesObject,//whole request obj which u send it for generating cadence,
      token:  token, //token stored
      userId: this.state.sessionUserId,
    });
  };

createRooms = ()=>{
    this.socket.emit('create room', {
        token: token //token stored
    })
}