import { OpenAIApi } from "openai";

export function getRecommendations(recommendationCategoryList, searchHistory){
    let categoryScore;

    // populate the map
    let i;
    for(i = 0; i<recommendationCategoryList.length; i++){
        console.log(recommendationCategoryList[i]);
        // categoryScore[recommendationCategoryList[i]];
    }
    console.log(categoryScore);
}


