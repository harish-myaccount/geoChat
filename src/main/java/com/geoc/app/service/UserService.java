package com.geoc.app.service;

import java.nio.charset.Charset;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.GeoResults;
import org.springframework.data.geo.Metrics;
import org.springframework.stereotype.Service;

import com.geoc.app.model.ConnectedUser;
import com.geoc.app.repository.UserRepository;

@Service
public class UserService {
	  @Autowired 
	  UserRepository repo;
	  private final static String GRAVATAR="http://www.gravatar.com/avatar/";
	  
	  public void saveUser(ConnectedUser user){
		  repo.save(user);
	  }
	  
	  public GeoResults<ConnectedUser> getUsersNearBy(ConnectedUser user){
		 return repo.findByEmailNotAndTaglineNotNull(user.getEmail(),user.getLocation(),new Distance(1, Metrics.KILOMETERS));
	  }

	public ConnectedUser addQuestion(ConnectedUser user) {
		ConnectedUser updatedUser = repo.findOne(user.getEmail());
		MessageDigest messageDigest=null;
		try {
			messageDigest = MessageDigest.getInstance("MD5");
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
		messageDigest.reset();
		messageDigest.update(user.getEmail().getBytes(Charset.forName("UTF8")));
		final byte[] resultByte = messageDigest.digest();		 
        //convert the byte to hex format method 1
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < resultByte.length; i++) {
          sb.append(Integer.toString((resultByte[i] & 0xff) + 0x100, 16).substring(1));
        }
 
		updatedUser.setImage(GRAVATAR+sb.toString()+".jpg?s=200");
				updatedUser.setTagline(user.getTagline());
				repo.save(updatedUser);
				return updatedUser;
	}

}
