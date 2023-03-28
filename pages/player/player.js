// player.js
const util = require('../../utils/util.js')
Page({
  data: {
    audio:'',
    logs: [],
    query:'',
    musicList:[],
    musicUrl:"",
    musicCover:"",
    hotComments:[],
    isPlaying:false,
    isShow:false,
    mvUrl:"",
    mymusicList:[],
    mylistname:[],
    lyriclist:[],
    lyric:'',
    liston:false,
    liston2:false,
    currentTime:'',
    index:0
  },
  onLoad() {
    this.setData({
      audio:wx.createInnerAudioContext()
    })
    this.data.audio.onEnded(() => {
      this.nextMusic()
    })
  },
  showmylist(){
    if(this.data.liston){
      this.setData({
        liston:false
      })
    }
    else{
      this.setData({
        liston:true
      })
    }
  },
  playlist:function(e){
    let id = e.currentTarget.dataset.item
    let name = this.data.mylistname[this.data.mymusicList.indexOf(id)]
    console.log(name)
    return "name"
},
playlist2(id){
  let name = this.data.mylistname[this.data.mymusicList.indexOf(id)]
  return name
},
  search(){
    wx.request({
      url: 'https://autumnfish.cn/search',
      data:{
        keywords:this.data.query
      },
      success: (result) => {
        console.log(result)
        this.setData({
          musicList:result.data.result.songs
        })
      },
      fail: (res) => {},
      complete: (res) => {},
    })
  },
  changePlayingState(){
    if(this.data.isPlaying||this.data.mymusicList.length == 0){
      this.setData({
        isPlaying:false
      })
      this.data.audio.pause()
    }
    else{
      this.setData({
        isPlaying:true
      })
      this.data.audio.play()
    }
  },
  playandpause(url){
    if(url===this.data.musicUrl&&this.data.isPlaying){
      this.data.audio.pause()
      this.setData({
        isPlaying:false
      })
      return;
    }
    this.setData({
      musicUrl:url,
      isPlaying:true
    })
    this.data.audio.src = this.data.musicUrl
    this.data.audio.play()
  },
  nextMusic:function(){
    if(this.data.index==this.data.mymusicList.length-1){
      this.setData({
        index:0
      })
    }
    else{
      this.setData({
        index:this.data.index + 1
      })
    }
    console.log('test:'+this.data.mymusicList[this.data.index])
    this.playMusic2(this.data.mymusicList[this.data.index],this.data.mylistname[this.data.index])
},

  addmusicList:function(e){
    var newArray = this.data.mymusicList
    var newArray2 = this.data.mylistname
    var id = e.currentTarget.dataset.item
    var name = e.currentTarget.dataset.item2
    if(this.data.mymusicList.indexOf(id)==-1){
        newArray.push(id)
        newArray2.push(name)
        this.setData({
          mymusicList:newArray,
          mylistname:newArray2
        })
        console.log(this.data.mylistname)
        if(this.data.mymusicList.length==1){
            this.playMusic(e)
        }
    }
    else{
        newArray.splice(this.data.mymusicList.indexOf(id),1)
        newArray2.splice(this.data.mymusicList.indexOf(id),1)
        this.setData({
          mymusicList:newArray,
          mylistname:newArray2
        })
        if(this.data.mymusicList.length!=0){
          e.currentTarget.dataset.item = this.data.mymusicList[this.data.index]
          e.currentTarget.dataset.item2 = this.data.mylistname[this.data.index]
            this.playMusic(e)
        }
    }
    // console.log(this.mymusicList)
},
  inmusicList(e){
    var id = e.currentTarget.dataset.item
      if(this.data.mymusicList.indexOf(id)!=-1){
        console.log(this.data.mymusicList.indexOf(id))
          return "true"
      }
      else{
          return "false"
      }
  },
  inmusicList2:function(id){
      if(this.data.mymusicList.indexOf(id)!=-1){
        console.log(this.data.mymusicList.indexOf(id))
          return true;
      }
      else{
          return false;
      }
  },
  playMusic2(id,name){
    let newArray = this.data.mymusicList
    let newArray2 = this.data.mylistname
    wx.request({
      url: 'https://autumnfish.cn/song/url',
      data:{
        id:id
      },
      success:(result) => {
        if(!newArray.includes(id)){
          newArray.push(id)
          newArray2.push(name)
          this.setData({
            mymusicList:newArray,
            mylistname:newArray2,
            index:this.data.mymusicList.length-1
          })
      }
      else{
        this.setData({
          index:this.data.mymusicList.indexOf(id)
        })
      }
      console.log(result)
      console.log(this.data.mylistname[this.data.mymusicList.indexOf(id)])
      this.playandpause(result.data.data[0].url)
      }
    })
    wx.request({
      url: 'https://autumnfish.cn/song/detail',
      data:{
        ids:id
      },
      success:(result) => {
        this.setData({
          musicCover:result.data.songs[0].al.picUrl
        })
      }
    })
  },
  playMusic:function(e){
    let newArray = this.data.mymusicList
    let newArray2 = this.data.mylistname
    console.log(newArray2)
    var id = e.currentTarget.dataset.item
    var name = e.currentTarget.dataset.item2
    if(id==""){
      id = this.data.mymusicList[this.data.mylistname.indexOf(name)]
    }
    wx.request({
      url: 'https://autumnfish.cn/song/url',
      data:{
        id:id
      },
      success:(result) => {
        if(!newArray.includes(id)){
          newArray.push(id)
          newArray2.push(name)
          console.log(newArray)
          this.setData({
            mymusicList:newArray,
            mylistname:newArray2,
            index:this.data.mymusicList.length-1
          })
      }
      else{
        this.setData({
          index:this.data.mylistname.indexOf(name)
        })
      }
      console.log(result.data.data[0].url)
      console.log(this.data.musicUrl)
      this.playandpause(result.data.data[0].url)
      }
    })
    wx.request({
      url: 'https://autumnfish.cn/song/detail',
      data:{
        ids:id
      },
      success:(result) => {
        this.setData({
          musicCover:result.data.songs[0].al.picUrl
        })
      }
    })
    // axios.get("https://autumnfish.cn/comment/hot?type=0&id="+id)
    // .then(function(response){
    //     that.hotComments = response.data.hotComments
    // },function(err){})
    // axios.get("https://autumnfish.cn/lyric?id="+id)
    // .then(function(response){
    //     // console.log(response.data.lrc.lyric)
    //     var arr1 = response.data.lrc.lyric.split('\n')
    //     that.lyriclist = arr1
    //     // console.log(arr2)
    //     // console.log(response.data)
    //     // that.hotComments = response.data.hotComments
    // },function(err){})
},
  onInput(e){
    this.setData({
      query : e.detail.value
    })
  }
})
