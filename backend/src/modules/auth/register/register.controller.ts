import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RegisterUseCase } from "@src/modules/auth/register/register.useCase";
import {
  RegisterDto,
  CookSpeciality,
} from "@src/modules/auth/register/register.dto";
import { Public } from "@src/modules/auth/public.decorator";

@ApiTags("Auth")
@Public()
@Controller("auth")
export class RegisterController {
  constructor(private readonly registerUseCase: RegisterUseCase) {}

  @Post("register")
  @ApiOperation({
    summary: "Créer un compte",
    description:
      "Inscription d'un client ou d'un cuisinier. Si le rôle est cook, le champ cookProfile (avec speciality) est obligatoire.",
  })
  @ApiBody({
    type: RegisterDto,
    examples: {
      client: {
        summary: "Inscription client",
        value: {
          firstName: "Jean",
          lastName: "Dupont",
          email: "jean@test.fr",
          password: "password123",
        },
      },
      cook: {
        summary: "Inscription cuisinier",
        value: {
          firstName: "Marie",
          lastName: "Chef",
          email: "marie@test.fr",
          password: "password123",
          role: "cook",
          cookProfile: {
            speciality: CookSpeciality.ITALIAN,
            description: "Passionnée de pâtes fraîches depuis 10 ans.",
            hourlyRate: 25.5,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description:
      "Compte créé. Retourne le token JWT et les données utilisateur.",
  })
  @ApiResponse({
    status: 400,
    description: "Email déjà utilisé ou speciality manquante pour un cook.",
  })
  register(@Body() dto: RegisterDto) {
    return this.registerUseCase.execute(dto);
  }
}
