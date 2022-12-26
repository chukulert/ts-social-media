import { Request, Response, NextFunction } from "express";
import {
    dbCreatePost,
    dbFetchAllPosts,
    dbFetchPostById,
    dbLikePostById
} from "../services/postService";
import ApiError from "../types/apiError";

export const getAllPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const posts = await dbFetchAllPosts();
      res.status(200).json({ data: posts });
    } catch (e) {
      next(e);
    }
  };

  export const getPostById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const postId = +req.params.id;
    try {
      const post = await dbFetchPostById(postId);
      res.json({ data: post });
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  export const createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user.id as string
    const postData = req.body;

    try {
      const createdPost = await dbCreatePost(postData, userId);
      console.log(createdPost)
      res.json({ data: createdPost });
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  export const likePostById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user.id as string;
    const postId = +req.params.id;

    try {
      const post = await dbLikePostById(postId, userId);
      res.json({ data: post });
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

