package iuh.fit.se.todolistbackend.services;

import iuh.fit.se.todolistbackend.dto.request.LoginRequestDTO;
import iuh.fit.se.todolistbackend.dto.request.RegisterRequestDTO;
import iuh.fit.se.todolistbackend.dto.response.AuthResponseDTO;
import iuh.fit.se.todolistbackend.entity.Account;
import iuh.fit.se.todolistbackend.entity.User;
import iuh.fit.se.todolistbackend.exception.AppException;
import iuh.fit.se.todolistbackend.exception.ErrorCode;
import iuh.fit.se.todolistbackend.repository.AccountRepository;
import iuh.fit.se.todolistbackend.repository.UserRepository;
import iuh.fit.se.todolistbackend.security.CustomUserDetails;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;

    @Transactional
    public AuthResponseDTO register(RegisterRequestDTO request) {
        String username = request.getUsername().trim();
        String name = request.getName().trim();

        if (accountRepository.findAccountByUsername(username).isPresent()) {
            throw new AppException(ErrorCode.USER_ALREADY_EXISTS, "Tên đăng nhập đã tồn tại");
        }

        User user = User.builder()
                .name(name)
                .build();
        User savedUser = userRepository.save(user);

        Account account = Account.builder()
                .username(username)
                .password(passwordEncoder.encode(request.getPassword()))
                .user(savedUser)
                .build();

        Account savedAccount = accountRepository.save(account);
        return AuthResponseDTO.from(savedAccount);
    }

    public AuthResponseDTO login(LoginRequestDTO request, HttpServletRequest httpServletRequest,
            HttpServletResponse httpServletResponse) {
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername().trim(), request.getPassword()));
        } catch (Exception e) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS, "Đăng nhập thất bại");
        }

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, httpServletRequest, httpServletResponse);

        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails customUserDetails) {
            return new AuthResponseDTO(
                    customUserDetails.name());
        }

        return accountRepository.findAccountByUsername(request.getUsername().trim())
                .map(AuthResponseDTO::from)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS, "Đăng nhập thất bại"));
    }
}
