const calcPaginationData = ({total, page, perPage}) => {
        const totalPages = Math.ceil((total / perPage))
        const hasPrevPage = page !== 1
        const hasNextPage = page !== totalPages
        return {
            totalPages,
            hasNextPage,
            hasPrevPage
        }
}
export default calcPaginationData