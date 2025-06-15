import { appwriteConfig,database } from "@/auth/client"
import { ID, Query } from "appwrite"

export const getAllTrips = async (limit: number, offset: number) => {
    try {
        console.log("Fetching trips with limit:", limit, "and offset:", offset); // Debugging log

        const allTrips = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.tripsCollection,
            [
                Query.limit(limit),
                Query.offset(offset),
                Query.orderDesc('createdAt')
            ]
        );

        console.log("Fetched trips:", allTrips.documents); // Debugging log

        if (allTrips.total === 0) {
            console.error('No trips found');
            return {
                allTrips: [],
                total: 0
            };
        }

        return {
            allTrips: allTrips.documents,
            total: allTrips.total
        };
    } catch (error) {
        console.error('Error fetching trips:', error);
        throw error;
    }
};


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