package com.rbac.mapper;

import com.rbac.dto.response.UserResponse;
import com.rbac.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * MapStruct mapper for converting between User entity and UserResponse DTO.
 * MapStruct generates the implementation at compile time.
 */
@Mapper(componentModel = "spring")
public interface UserMapper {

    /**
     * Convert a User entity to a UserResponse DTO.
     * The role field is an enum on the entity but a String on the DTO;
     * MapStruct handles enum → String conversion automatically.
     */
    @Mapping(target = "role", expression = "java(user.getRole().name())")
    UserResponse toUserResponse(User user);
}
