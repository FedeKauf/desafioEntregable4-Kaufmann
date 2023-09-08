import {Router} from 'express'
import {pm} from '../productManager.js';
export const router=Router()



router.get('/', async (req, res) => {
    let limit = req.query.limit
    const products = await pm.getProducts()
    if(limit){
        res.status(200).render('home', {products:products.slice(0,limit)});
    }else{
        res.status(200).render('home', {products});
    }
})


router.get('/realtimeproducts', async (req, res) => {
    const products = await pm.getProducts()
    res.status(200).render('realTimeProducts', {products})
})


