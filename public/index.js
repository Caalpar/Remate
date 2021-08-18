function CountDown(ele,intial_day,final_day,now,w){

  let ini_day = GetTime(intial_day)
  let fin_day = GetTime(final_day)
  let inp = ele.parentElement.parentElement.childNodes[13]
  let win = (w === 'true');

  console.log(win)
  
  let t = setInterval(() => {
    

    if(ini_day<=now)
    {
      let distance = fin_day - now 

      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
      ele.innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

      if (distance < 0) {
        if(win)
        ele.innerHTML = '<span class="tag-finished win">adquirido</span>'
        else
        ele.innerHTML = '<span class="tag-finished">finalizado</span>'
        inp.disabled = true
        clearInterval(t);        
      }
    }
    let temp = parseFloat(now) + 1000
    now =  temp

  }, 1000);



}

function GetTime(day)
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




