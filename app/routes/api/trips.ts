import { appwriteConfig,database } from "@/auth/client"
import { ID, Query } from "appwrite"

export const getAllTrips =async(limit:number,offset:number)=>{
    const allTrips = await database.createDocument(
        appwriteConfig.projectId,
        appwriteConfig.tripsCollection,
        ID.unique(),[
            Query.limit(limit),Query.offset(offset),
            Query.orderDesc('createdAt')
        ]
    )

    if(allTrips.total ===0){
        console.error('No trips found');
        return {
            allTrips:[],
            total:0
        }
    }

    return{
        allTrips:allTrips.documents,
        total:allTrips.total
    }
}


export const getTripById =async(tripId:string)=>{
    const trip = await database.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.tripsCollection,
        tripId
    )

    if(!trip.$id){
        console.log("Trip not found");
        return null;
    }   

    //the whole trip
    return trip;
}