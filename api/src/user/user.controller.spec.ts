import {UserService} from "./user.service";
import {Test, TestingModule} from "@nestjs/testing";
import {HttpModule} from "@nestjs/common";
import {UserController} from "./user.controller";
import {UserEntity} from "./user.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {LoginUserDto} from "./dto/login-user.dto";
import {HttpException} from "@nestjs/common/exceptions/http.exception";
import {getConnection} from "typeorm";
import {UpdateUserDto} from "./dto/update-user.dto";

describe('etv API User Controller', () => {
    let userService: UserService;
    let controller: UserController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [HttpModule, TypeOrmModule.forFeature([UserEntity]),
                TypeOrmModule.forRoot({
                    type: 'mysql',
                    host: 'localhost',
                    port: 3306,
                    username: 'etvapp',
                    password: 'etvapp123456',
                    database: 'etvapp',
                    autoLoadEntities: true,
                    synchronize: true,
                })],
            controllers: [UserController],
            providers: [UserService],
        }).compile();
        userService = module.get<UserService>(UserService);
        controller = module.get<UserController>(UserController);
    });

    afterEach(async () => {
        jest.resetAllMocks();
        const defaultConnection = getConnection('default')
        await defaultConnection.close()
    });


    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('Should return 200 for health endpoint check', async () => {
        await controller.ping().then(response => {
            expect(response).toEqual('Alive');
        });
    });

    it('Should Expect login Exception', async () => {
        let user = new LoginUserDto();
        await controller.login(user).catch((error) => {
            expect(error instanceof HttpException).toBe(true);
        });
    });

    it('Should Expect Successful Login ', async () => {
        let userEntity = new UserEntity();
        userEntity.username = 'testing';
        userEntity.password = 'password';
        jest.spyOn(userService, 'findOne').mockReturnValue(Promise.resolve(userEntity))
        let user = new LoginUserDto();
        await controller.login(user).then(response => {
            expect(response.user.token).toBeTruthy();
            expect(response.user.username).toEqual('testing');
        })
    });

    it('Should Expect Successful User Update ', async () => {
        let userUpdateDao = new UpdateUserDto();
        let userEntity = new UserEntity();
        userEntity.username = 'testing';
        userEntity.password = 'password';
        userEntity.email ='testing123@gmail.com';
        userEntity.id =1;
        jest.spyOn(userService, 'update').mockReturnValue(Promise.resolve(userEntity))
        await controller.update(1,userUpdateDao).then(response => {
            expect(response.email).toBeTruthy();
            expect(response.password).toBeTruthy();
        })
    });
})
