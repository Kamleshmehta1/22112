import { postApi } from "."
import { createSelector } from "@reduxjs/toolkit"

export const getSelectors = (
    query,
) => {
    const selectSetupsResult = postApi.endpoints.getSetups.select(query)

    const adapterSelectors = createSelector(
        selectSetupsResult,
        (result) => result
    )

    return {
        selectAll: createSelector(adapterSelectors, (s) =>
            s.selectAll(undefined)
        ),
    }
}

export const { } = getSelectors;