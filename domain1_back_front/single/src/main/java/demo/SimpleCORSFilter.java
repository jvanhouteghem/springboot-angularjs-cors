package demo;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class SimpleCORSFilter implements Filter {
	
    public SimpleCORSFilter() {
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) res;
        HttpServletRequest request = (HttpServletRequest) req;
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        response.setHeader("Access-Control-Max-Age", "5000");
        // response.setHeader("Access-Control-Allow-Headers", "x-requested-with, authorization");
        //response.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization");
        response.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization, X-XSRF-TOKEN"); // Fix : Request header field X-XSRF-TOKEN is not allowed by Access-Control-Allow-Headers in preflight response.

        // Bypass preflight error
         if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
        	System.out.println("WITHOPTION");
            response.setStatus(HttpServletResponse.SC_OK);
            
            // Test
           /* Cookie myCookie = new Cookie("test","");
            myCookie.setValue("testValue");
            myCookie.setPath("/");
            //myCookie.setDomain("localhost:8080");
            response.addCookie(myCookie);*/
        } else {
        	System.out.println("WITHOUTPTION");
            chain.doFilter(req, res);
        }
    }
    
    
    @Override
    public void init(FilterConfig filterConfig) {
    }

    @Override
    public void destroy() {
    }

}