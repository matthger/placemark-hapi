import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const JwtAuth = Joi.object()
    .keys({
        success: Joi.boolean().example("true").required(),
        _id: IdSpec,
        firstName: Joi.string().example("Homer").required(),
        lastName: Joi.string().example("Simpson").required(),
        token: Joi.string().example("eyJhbGciOiJND.g5YmJisIjoiaGYwNTNjAOhE.gCWGmY5-YigQw0DCBo").required(),
    })
    .label("JwtAuth");

export const UserCredentialsSpec = Joi.object()
    .keys({
        email: Joi.string().email().example("homer@simpson.com").required(),
        password: Joi.string().example("secret").required(),
    })
    .label("UserCredentials");

export const UserSpec = UserCredentialsSpec.keys({
    firstName: Joi.string().example("Homer").required(),
    lastName: Joi.string().example("Simpson").required(),
    isAdmin: Joi.boolean().example(false).required(),
}).label("UserDetails");

export const UserSpecPlus = UserSpec.keys({
    _id: IdSpec,
    __v: Joi.number(),
}).label("UserDetailsPlus");

export const UserArray = Joi.array().items(UserSpecPlus).label("UserArray");

export const PasswordSpec = Joi.object()
    .keys({
        currentPassword: Joi.string().example("secret").required(),
        newPassword: Joi.string().example("secret2").required(),
    })
    .label("Password");

export const CategorySpec = Joi.object()
    .keys({
        name: Joi.string().example("Sightseeing"),
        description: Joi.string().example("Sightseeing in Germany"),
        user: IdSpec,
        img: Joi.string().optional().allow(''),
    })
    .label("Category");

export const CategorySpecPlus = CategorySpec.keys({
    _id: IdSpec,
    __v: Joi.number(),
    placemarks: Joi.array().optional()
}).label("CategoryPlus");

export const CategoryArraySpec = Joi.array().items(CategorySpecPlus).label("CategoryArray");

export const PlacemarkSpec = Joi.object()
    .keys({
        name: Joi.string().required().example("Brandenburger Tor"),
        description: Joi.string().required().example("Berlin"),
        lat: Joi.number().required().example(52.5163),
        lng: Joi.number().required().example(13.377),
        category: Joi.alternatives(IdSpec, CategorySpecPlus),
        img: Joi.string().optional().allow('')
    })
    .label("Placemark");

export const PlacemarkSpecPlus = PlacemarkSpec.keys({
    weather: Joi.object().optional(),
    country: Joi.object().optional(),
    temp: Joi.object().optional(),
    _id: IdSpec,
    __v: Joi.number(),
}).label("PlacemarkPlus");

export const PlacemarkArraySpec = Joi.array().items(PlacemarkSpecPlus).label("PlacemarkArray");