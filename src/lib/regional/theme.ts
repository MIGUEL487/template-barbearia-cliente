import type {RegionalProfile} from './profile';
export function regionalTheme(region:RegionalProfile):Record<string,string> {
 const primary=region.palette.primary;if(!primary)return {};
 const rgb=[1,3,5].map(i=>parseInt(primary.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
 const light=rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722<.35;
 return {'--regional-bg':light?'#f5eddf':'#151923','--regional-surface':light?'#fff9ef':'#232936','--regional-text':light?'#25241f':'#f7f4ee','--regional-muted':light?'#62564d':'#c7c5c1','--regional-border':light?'#d8cabb':'#495162','--regional-accent':primary,'--regional-on-accent':light?'#fff9ef':'#1b1e26'};
}
