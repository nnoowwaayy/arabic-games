import type {AnchorHTMLAttributes} from 'react';
// Native links keep navigation reliable in both the Worker and Node browser builds.
export default function Link(props:AnchorHTMLAttributes<HTMLAnchorElement>){return <a {...props}/>;}
