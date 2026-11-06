/** Time-based adjacent-frame pacing. No queue, skipped frames or hidden-tab catch-up. */
export function createFramePacer(mobile:boolean){
 let previous:number|null=null,speed=0,credit=0,direction=0;
 return {ready(time:number,remaining:number){
  const nextDirection=Math.sign(remaining),dt=previous===null?0:Math.max(0,Math.min(.05,time-previous));previous=time;
  if(!remaining){speed=0;credit=0;direction=0;return false}
  if(nextDirection!==direction){speed=0;credit=0;direction=nextDirection}
  const acceleration=mobile?72:96,max=remaining>0?(mobile?24:30):(mobile?30:36);
  const desired=Math.min(max,Math.sqrt(2*acceleration*Math.abs(remaining)));
  speed+=Math.max(-acceleration*dt,Math.min(acceleration*dt,desired-speed));
  credit=Math.min(1,credit+speed*dt);
  if(credit<1)return false;credit=0;return true;
 }};
}
