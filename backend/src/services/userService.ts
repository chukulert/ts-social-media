import { Prisma, PrismaClient, User } from "@prisma/client";
import ApiError from "../types/apiError";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET_KEY, JWT_EXPIRES_IN } from "../utils/constants";
import userSchema from "../models/userSchema";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

export const dbFetchAllUsers = async () => {
  const allUsers = await prisma.user.findMany();
  return allUsers;
};

export const dbFetchUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) throw ApiError.notFound("User not found");

  return user;
};

export const dbCreateUser = async (userData: Prisma.UserCreateInput) => {
  await checkValidData(userData);

  const hashedPassword = await bcrypt.hash(userData.password as string, 12);

  const isInvalidEmail = await checkEmailValid(userData.email as string);
  if (isInvalidEmail) throw ApiError.badRequest("Email is already in use");

  const createdUser = await prisma.user.create({
    data: {
      email: userData.email,
      password: hashedPassword,
    },
  });

  return createdUser;
};

export const dbLogin = async (email: string, password: string) => {
  const user = await dbFetchUserByEmail(email);
  if (!user) throw ApiError.notFound("User not found");

  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password as string
  );
  if (!isPasswordCorrect) throw ApiError.badRequest("Wrong password");

  const sanitizedUser = omitUserFields(user);

  const token = signToken(user.id);

  return {
    user: sanitizedUser,
    token,
  };
};

export const dbEditUserProfile = async (
  user: Prisma.UserCreateInput,
  editData: Prisma.UserCreateInput
) => {
  await checkValidData(editData);

  if (user.email !== editData.email) {
    const isInvalidEmail = await checkEmailValid(editData.email as string);
    if (isInvalidEmail) throw ApiError.badRequest("Email is already in use");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      email: editData.email,
      profile_photo: editData.profile_photo,
      profile_summary: editData.profile_summary,
      display_name: editData.display_name,
    },
  });
  return updatedUser;
};

const dbFetchUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return user;
};

const checkEmailValid = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return Boolean(user);
};

const signToken = (id: string) => {
  return jwt.sign({ id }, SECRET_KEY, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

const checkValidData = async (userData: Prisma.UserCreateInput) => {
  try {
    await userSchema.validate(userData);
  } catch (e: unknown) {
    if (e instanceof Error) throw ApiError.yupValidationError(e.message);
  }
};

const omitUserFields = (user: User) => {
  return Object.assign({}, user, {
    password: undefined,
    role: undefined,
  })
};
