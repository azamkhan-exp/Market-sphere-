import { DEMO_REVIEWS } from "./demoData";
import { ReviewItem } from "../types";

let inMemoryReviews = [...DEMO_REVIEWS];

export class DemoReviewRepository {
  static async findByProductId(productId: string): Promise<ReviewItem[]> {
    return inMemoryReviews.filter((r) => r.productId === productId);
  }

  static async create(data: {
    productId: string;
    userId: string;
    rating: number;
    title?: string;
    comment: string;
    userName?: string;
  }): Promise<ReviewItem> {
    const newReview: ReviewItem = {
      id: `rev_${Date.now()}`,
      productId: data.productId,
      userId: data.userId,
      rating: data.rating,
      title: data.title || null,
      comment: data.comment,
      isVerifiedPurchase: true,
      helpfulVotes: 0,
      createdAt: new Date(),
      user: { name: data.userName || "Verified Customer", avatar: null },
    };

    inMemoryReviews.unshift(newReview);
    return newReview;
  }
}
