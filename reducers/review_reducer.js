const FETCH_ALL_REVIEWS = 'fetch_all_reviews';
// 初期データ
const INITIAL_STATE = {
  allReviews: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_ALL_REVIEWS:
      return { ...state, allReviews: action.payload };
  
    default:
      return state;
  }
};