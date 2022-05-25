import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import {User} from "./user.entity";
import {BadRequestException, NotFoundException} from "@nestjs/common";


describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        // create fake users service copy
        const users: User[] = [];
        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email);
                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string) => {
                const newUser = {
                  id: Math.floor(Math.random() * 99999),
                  email,
                  password
                } as User;
                users.push(newUser);
                return Promise.resolve(newUser);
            }
        };

        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile();

        service = module.get(AuthService);
    });

    it('can create an instance of auth service',async () => {
        expect(service).toBeDefined();
    });

    it('creates a new user with a salted and hashed password', async () => {
        const user = await service.signUp('test@unit.com', '12gh45j6');
        expect(user.password).not.toEqual('12gh45j6');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('throws an error if user signs up with email that is already in use', async () => {
        await service.signUp('test-existing@unit.com', 'asdsadasd');
        try {
            await service.signUp('test-existing@unit.com', 'asdsadasd');
        } catch (e) {
            expect(e).toBeInstanceOf(BadRequestException);
        }
    });

    it('throws error if signIn is called with an unregistered email', async () => {
        try {
            await service.signIn('test-signIn@unit.com', 'asdsadasd');
        } catch (e) {
            expect(e).toBeInstanceOf(NotFoundException);
        }
    });

    it('throws error if invalid password is provided', async () => {
        await service.signUp('test@unit.com', '12gh45j6');
        try {
            await service.signIn('test@unit.com', 'asdsadasd');
        }catch (e) {
           expect(e).toBeInstanceOf(BadRequestException);
        }
    });

    it('returns user if correct password is provided', async () => {
        await service.signUp('test@unit.com', '12gh45j6');
        const user = await service.signIn('test@unit.com', '12gh45j6');
        expect(user).toBeDefined();
    });



});
