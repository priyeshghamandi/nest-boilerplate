import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import {UsersService} from "./users.service";
import {User} from "./user.entity";
import {AuthService} from "./auth.service";
import {NotFoundException} from "@nestjs/common";

describe('UsersController', () => {
    let controller: UsersController;
    let fakeUsersService: Partial<UsersService>;
    let fakeAuthService: Partial<AuthService>;

    beforeEach(async () => {

        // create fake users service copy
        fakeUsersService = {
            findOne: (id: number) => {
                return Promise.resolve({id, email: 'test@unit.com', password: '12gh45j6'} as User)
            },
            find: (email: string) => {
                return Promise.resolve([{id: 1, email: 'test@unit.com', password: '12gh45j6'} as User]);
            },
            remove: (id: number) => {
                return Promise.resolve({} as User);
            },
            update: () => {
                return Promise.resolve({} as User);
            }
        };

        fakeAuthService = {
            signUp: (email: string, password: string) => {
                return Promise.resolve({id: 1, email, password} as User);
            },
            signIn: (email: string, password: string) => {
                return Promise.resolve({id: 1, email, password} as User);
            }
        };


        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                },
                {
                    provide: AuthService,
                    useValue: fakeAuthService
                }
            ]
        }).compile();

        controller = module.get<UsersController>(UsersController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('findAllUsers returns a list of users with the given email', async () => {
        const users = await controller.findAllUsers('test@unit.com');
        expect(users.length).toEqual(1);
        expect(users[0].email).toEqual('test@unit.com');
    });

    it('findUser should return one user with given id', async () => {
        const user = await controller.findUser('1');
        expect(user).toBeDefined();
        expect(user.id).toEqual(1);
    });

    it('findUser should throw NotFoundException exception if user with given id is not found', async () => {
        fakeUsersService.findOne = () => null;
        try{
            await controller.findUser('2');
        }catch (e) {
            expect(e).toBeInstanceOf(NotFoundException);
        }
    });

    it('signIn should update session object and return user', async () => {
        const session = {userID: 0};
        const user = await controller.signIn(
        { email: 'test@unit.com', password: '12gh45j6' },
               session
        );

        expect(user.id).toEqual(1);
        expect(session.userID).toEqual(1);

    });

    it('whoAmI should return current user ', async () => {
        const session = {userID: 0};
        const user = await controller.signIn(
            { email: 'test@unit.com', password: '12gh45j6' },
            session
        );
        const currentUser = controller.whoAmI(user);

        expect(currentUser).toEqual(user);
    });
});