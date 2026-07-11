
export const buildProductQuery = (search,category)=>
{
    let query = {};
    if(search)
    {
        query.$text={$search:search}
    }
    if(category)
    {
        query.category=category
    }
    return query;
}