import { RootState } from 'data/store'

const useDashboardKey = (
  getState: () => RootState
) => {
  let {
    user: {
      dashboardKey
    },
  } = getState()

  return dashboardKey
}

export default useDashboardKey