const path = require('path')



let url_img = path.join(__dirname ,'../assets/imgs/')

module.exports.SendClientJSON = (res,object,con = true) =>
{
    if(typeof object != 'undefined')
    {
        if(con)
        console.log(object.msg)
        if(res!==null)       
            res.json(render)     
    }
}


module.exports.SendClientRender = (res,render,render_options=null) =>
{
        if(res!==null)
        {
            if(render_options==null)
            res.render(render)
            else
            res.render(render,render_options)
        }
}


module.exports.GetTime = (day) =>
{
      let date_arr = day.split('T')
      let day_arr = date_arr[0].split('-')
      let hours_arr = date_arr[1].split(':')

    let year = day_arr[0]
    let month = day_arr[1]
    let d = day_arr[2]

    let hours = hours_arr[0]
    let minutes = hours_arr[1]

    return new Date(year,month,d,hours,minutes,0,0).getTime()

}


module.exports.GetTimeNow = () =>{
    let current = new Date()
    let y = current.getFullYear()
    let m = current.getMonth() + 1
    let d = current.getDate()
    let hu =  current.getHours()
    let min =  current.getMinutes()
    let sec =  current.getSeconds()

    return new Date(y,m,d,hu,min,sec,0).getTime();
}

module.exports.tools = {
    url_img: url_img
}