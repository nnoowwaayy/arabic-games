export async function api<T>(path:string,method='GET',body?:unknown):Promise<T>{
 const response=await fetch(`/api/${path}`,{method,headers:body?{'Content-Type':'application/json'}:undefined,body:body?JSON.stringify(body):undefined});
 const data=await response.json() as T&{error?:string};if(!response.ok)throw new Error(data.error??'Request failed');return data;
}
