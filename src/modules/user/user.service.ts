import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/registerUser.dto';
import { JwtService } from '@nestjs/jwt';
import * as bCrypt from "bcrypt";
import { LoginUserDto } from './dto/loginUser.dto';
import { PrismaService } from "../prisma/prisma.service";
import { User, Prisma } from "@prisma/client";

@Injectable()
export class UserService {
    constructor(
        private prismaService: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    registerUser(data: RegisterUserDto) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                //check if email already exists
                const user = await this.prismaService.user.findFirst({
                    where: {
                        email: data.email
                    }
                });

                if (user) {
                    resolve({
                        status: false,
                        message: `Email already exists`
                    });
                }
                else {
                    //hash user's password
                    const hashedPassword: any = await this.hashString(data.password);
                    if (hashedPassword.status) {
                        let userObj: Prisma.UserCreateInput = {
                            email: data.email,
                            firstName: data.firstName,
                            lastName: data.lastName,
                            password: hashedPassword.result
                        };

                        await this.prismaService.user.create({
                            data: userObj,
                        });

                        resolve({
                            status: true,
                            message: `User registered successfully`
                        });
                    }
                    else {
                        resolve({
                            status: false,
                            message: `Error in hashing the password`
                        });
                    }
                }
            }
            catch (e) {
                console.log(e);
                reject(e);
            }
        });
    }

    loginUser(data: LoginUserDto) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                //check if user exists already
                const user: User = await this.prismaService.user.findFirst({
                    where: {
                        email: data.email
                    }
                });

                if (user) {
                    //compare password
                    const isPasswordVerified: any = await this.compareHashString(data.password, user.password);
                    if (isPasswordVerified == true) {
                        //create JWT using user details
                        const jwt = await this.jwtService.signAsync({
                            id: user.id,
                            role: user.role
                        });

                        //remove keys from final response
                        const { password, createdAt, updatedAt, ...result } = user;

                        resolve({
                            status: true,
                            message: `Welcome ${user.firstName}`,
                            token: jwt,
                            result: result
                        });
                    }
                    else {
                        resolve({
                            status: false,
                            message: `Invalid credentials`
                        });
                    }
                }
                else {
                    resolve({
                        status: false,
                        message: `Invalid credentials`
                    });
                }
            }
            catch (err: any) {
                console.log(err);
                reject(err);
            }
        });
    }

    hashString(string: string) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                bCrypt.hash(string, 10, async (err, hashedString) => {
                    if (err) {
                        console.log(err);
                        resolve({
                            status: false,
                            error: err
                        });
                    }
                    else {
                        resolve({
                            status: true,
                            result: hashedString
                        });
                    }
                });
            } catch (e) {
                console.log(e);
                reject(e);
            }
        });
    }

    compareHashString(string: string, hashString: string) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                bCrypt.compare(string, hashString, async (err, isVerified) => {
                    if (err) {
                        console.log(err);
                        resolve(false);
                    } else {
                        if (isVerified) {
                            resolve(isVerified);
                        } else {
                            resolve(false);
                        }
                    }
                });
            } catch (e) {
                console.log(e);
                reject(e);
            }
        });
    }

    getUserDetails(userId: string) {
        return new Promise(async (resolve: any, reject: any) => {
            try {
                //check if user exists already
                const user: User = await this.prismaService.user.findUnique({
                    where: {
                        id: userId
                    }
                });

                if (user) {
                    const { password, createdAt, updatedAt, ...result } = user;

                    resolve({
                        status: true,
                        result: result
                    });
                }
                else {
                    resolve({
                        status: false,
                        message: `User doesn't exists`
                    });
                }
            }
            catch (err: any) {
                console.log(err);
                reject(err);
            }
        });
    }
}
