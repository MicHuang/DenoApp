import { Application } from 'https://deno.land/x/oak/mod.ts'
import router from './routes.ts'


const port: number = 5000

const app = new Application()



app.use(router.routes())
app.use(router.allowedMethods())




console.log('Server running on port 5000')


await app.listen({port})
