package com.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.ApiResponse;
import com.app.dto.ForgotPassword;
import com.app.dto.JwtResponse;
import com.app.dto.LoginRequestDto;
import com.app.dto.SignUpRequestDto;
import com.app.jwt.api.util.JwtUtil;
import com.app.pojos.ConfirmationToken;
import com.app.pojos.Owner;
import com.app.service.ConfirmationToken_Service;
import com.app.service.EmailService;
import com.app.service.Owner_Service;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/owners")
public class OwnerController {
	@Autowired
	private Owner_Service owner_Service;

	@Autowired
	private ConfirmationToken_Service confirmationToken_Service;

	@Autowired
	private EmailService emailService;

	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
	private AuthenticationManager manager;

	public OwnerController() {
	}

	@GetMapping
	public List<Owner> getAllOwners() {
		return owner_Service.getAllDetails();
	}

	@DeleteMapping("/{ownerId}")
	public ApiResponse deleteOwnerDetails(@PathVariable Long ownerId) {
		return new ApiResponse(owner_Service.deleteOwnerDetails(ownerId));
	}

	@GetMapping("/{ownerId}")
	public Owner getOwnerDetails(@PathVariable Long ownerId) {
		return owner_Service.fetchOwnerDetails(ownerId);
	}

	@PutMapping
	public Owner updateOwnerDetails(@RequestBody Owner detachedOwner) {
		return owner_Service.updateOwnerDetails(detachedOwner);
	}

	@PostMapping("/signUp")
	public ApiResponse registerUser(@RequestBody SignUpRequestDto transientOwner) {

		Owner existingUser = owner_Service.fetchByEmail(transientOwner.getEmail());
		if (existingUser != null) {
			return new ApiResponse("message This email already exists!");
		} else {
			Owner owner = owner_Service.addOwnerDetails(transientOwner);

			ConfirmationToken confirmationToken = new ConfirmationToken(owner);

			confirmationToken_Service.save(confirmationToken);

			SimpleMailMessage mailMessage = new SimpleMailMessage();
			mailMessage.setTo(owner.getEmail());
			mailMessage.setSubject("Complete Registration!");
			mailMessage.setText("To confirm your account, please click here : "
					+ "http://localhost:8080/owners/confirm-account?token=" + confirmationToken.getConfirmationToken());

			emailService.sendEmail(mailMessage);

			return new ApiResponse(
					"Registration Successfull, please verify your email by clicking the activation link sent on your email");
		}

	}

	@RequestMapping(value = "/confirm-account", method = { RequestMethod.GET, RequestMethod.POST })
	public String confirmUserAccount(@RequestParam("token") String confirmationToken) {
		ConfirmationToken token = confirmationToken_Service.fetchByConfirmationToken(confirmationToken);

		if (token != null) {
			Owner user = owner_Service.fetchByEmail(token.getOwner().getEmail());
			System.out.println(user);
			user.setEnabled(true);
			owner_Service.updateOwnerDetails(user);
			return " <div style=\"display: flex;flex-direction: column;justify-content: center;align-items: center;border: 1px solid rgb(178, 220, 222);\r\n"
					+ "    border-radius: 10px;\r\n" + "    width: 100%;\r\n"
					+ "    height: 100%;background-color: rgb(178, 220, 222);font-family: cursive;\">\r\n"
					+ "        <h1>Your account is verified!</h1>\r\n"
					+ "    <button><a href=\"http://localhost:3000/login\">click here to login</a></button>\r\n"
					+ "    </div>";
		} else {
			return "<h1>The link is invalid or broken!</h1>";
		}
	}

	@PostMapping("/signIn")
	public ResponseEntity<?> generateToken(@RequestBody LoginRequestDto LoginRequestDto) throws Exception {
		try {
			UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(LoginRequestDto.getEmail(), LoginRequestDto.getPassword());
			Authentication authenticatedDetails = manager.authenticate(authToken);
			String jwt = jwtUtil.generateJwtToken(authenticatedDetails);
			Owner owner = owner_Service.fetchByEmail(LoginRequestDto.getEmail());
			if (owner.isEnabled()) {
				return ResponseEntity.ok(new JwtResponse(jwt, owner));
			} else
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		} catch (Exception ex) {
			throw new Exception("inavalid username/password");
		}
		
		
	}

	@PostMapping("/forgotPassword")
	public String forgotPassword(@RequestBody ForgotPassword fp) {
		Owner user = owner_Service.fetchByEmail(fp.getEmail());
		if(user !=null) {
		SimpleMailMessage mailMessage = new SimpleMailMessage();
		mailMessage.setTo(fp.getEmail());
		mailMessage.setSubject("Your credentials for the Payment reminder app");
		mailMessage.setText("Your login credentials \nEmail : " + user.getEmail() + "\nPassword : "
				+ user.getPassword() + ".");
		emailService.sendEmail(mailMessage);
		return "Your password has been sent on your email";
		}
		else
			return "Account not exist";

	}
}
