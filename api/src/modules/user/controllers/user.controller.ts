import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { JwtAccessTokenPayloadDto } from 'src/modules/auth/dtos/request/jwt-access-token-payload.dto';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { UpdateUserDto } from '../dtos/requests/update-user.dto';
import { UserDto } from '../dtos/responses/user.dto';
import { UserService } from '../services/user.service';
import {omit} from "lodash"
import { NOT_ALLOWED_SELF_UPDATE, ONLY_ADMIN_SEARCH_FIELDS } from '../constants/user.constat';
import { CreateUserDto } from '../dtos/requests/create-user.dto';
import { SearchUserDto } from '../dtos/requests/search-user.dto';
import { Pagination } from 'src/common/dto/responses/Pagination.dto';
@ApiTags('User')
@Controller('user')
export class UserController {

  constructor(
    private readonly userService: UserService
  ){}

  @UseGuards(AuthGuard)
  @Get('self')
  @HttpCode(HttpStatus.OK)
  async getSelf(@CurrentUser() currentUser: JwtAccessTokenPayloadDto) {
    const user = await this.userService.getById(currentUser.id);
    return new UserDto(user).toSelfResponse();
  }


  @UseGuards(AuthGuard)
  @Put('self')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateSelf(@CurrentUser() currentUser: JwtAccessTokenPayloadDto, @Body() payload: UpdateUserDto) {
    return this.userService.updateById(currentUser.id, omit(payload, NOT_ALLOWED_SELF_UPDATE));
  }


  @UseGuards(AuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param("id") id: string) {
    const user = await this.userService.getById(id);
    if(!user){
      throw new NotFoundException("User with this id does not exist.")
    }
    // check relationship between users to determie reponse types

    return new UserDto(user).toPublicResponse()
  }


  @UseGuards(AuthGuard)
  @Get('')
  @HttpCode(HttpStatus.OK)
  async searchUser(@Query() query: SearchUserDto) {
    const {users, total} = await this.userService.search(omit(query, ONLY_ADMIN_SEARCH_FIELDS))
    return new Pagination(users.map(user => new UserDto(user)), query.pageSize, query.pageNumber, total)
  }
}