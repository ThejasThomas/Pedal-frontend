import { axiosInstance } from "./axiosInstance"

export const addProductOfferApi = async (
    id,
    productName,
    offerName,
    offerValue,
    offerExpairyDate,
    target_type
) => {
  return await axiosInstance.post("/admin/addProductOffer",{
    id,
    productName,
    offerName,
    offerValue,
    offerExpairyDate,
    target_type,
  })
}

export const addCategoryOfferApi = async (
    id,
    offerName,
    offerValue,
    offerExpairyDate,
    target_type,
    CategoryName,
  ) => {
    return await axiosInstance.post("/admin/addCategoryOffer",{
        id,
    CategoryName,
    offerName,
    offerValue,
    offerExpairyDate,
    target_type, 
    })
  }

  export const fetchCatApi = async()=>{
    try{
      return await axiosInstance.get("/admin/fetchCatOffer");
    }catch(err){
     console.log(err);
    }
  }

 export const fetchProdOfferApi = async ()=>{
    try{
        return await axiosInstance.get("/admin/fetchProdOffer");
      }catch(err){
       console.log(err);
      }
    }
 

  export const removeOffer = async (_id,categoryid) => {
    try{
        return await axiosInstance.delete("/admin/deleteOffer", {
            data: { _id,categoryid }
          } );
      }catch(err){
       console.log(err);
      }
   
  };

  export const findProductAndCategoryOfferApi = async (
    product_id,
    category_id,
    product_price
  ) => {
  
    return await axiosInstance.get("/user/fetchOffer", {
      params: {
        product_id,
        category_id,
        product_price,
      },
    });
  };
  