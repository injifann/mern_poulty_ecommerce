export const buildSortBy=(sort)=>
{
    let sortBy = {createdAt:-1}; 
    switch(sort)
    {
        case "oldest":
        {
          sortBy = {createdAt:1}
        }
        break;
        case "priceAsc":
        {
           sortBy={price:1}
        }
        break;
        case "priceDesc" :
        {
           sortBy = {price:-1}
        }
        break;
        case "highestRated":
        {
           sortBy = {averageRating:-1}
        }
        break;
        default:
        {
            sortBy={createdAt:-1}
        }
    }

    return sortBy;

}